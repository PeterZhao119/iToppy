//! 桌宠窗口按区域点击穿透：懒式 swizzle NSView 的 `hitTest:`，
//! 命中表内 Region（窗口坐标、point 单位、y 向下）走原实现，表外返回 nil 穿透。
//! Region 由前端按 sprite 不透明像素包围盒 + 名字牌 + 气泡的并集上报。

use serde::{Deserialize, Serialize};
use tauri::AppHandle;

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Region {
    pub x: f64,
    pub y: f64,
    pub w: f64,
    pub h: f64,
}

#[cfg(target_os = "macos")]
mod imp {
    use super::Region;
    use objc::runtime::{
        class_addMethod, class_getInstanceMethod, method_exchangeImplementations, Class, Imp,
        Object, Sel,
    };
    use objc::{msg_send, sel, sel_impl, Encode, Encoding};
    use std::collections::{HashMap, HashSet};
    use std::sync::{Mutex, OnceLock, RwLock};
    use tauri::{AppHandle, Manager, WebviewWindow};

    #[repr(C)]
    #[derive(Clone, Copy)]
    struct NSPoint {
        x: f64,
        y: f64,
    }

    #[repr(C)]
    #[derive(Clone, Copy)]
    struct NSSize {
        width: f64,
        height: f64,
    }

    #[repr(C)]
    #[derive(Clone, Copy)]
    struct NSRect {
        origin: NSPoint,
        size: NSSize,
    }

    unsafe impl Encode for NSPoint {
        fn encode() -> Encoding {
            // NSPoint 由两个 double 组成（64 位下 CGFLOAT_IS_DOUBLE）。
            unsafe { Encoding::from_str("{NSPoint=dd}") }
        }
    }

    unsafe impl Encode for NSSize {
        fn encode() -> Encoding {
            unsafe { Encoding::from_str("{NSSize=dd}") }
        }
    }

    unsafe impl Encode for NSRect {
        fn encode() -> Encoding {
            unsafe { Encoding::from_str("{NSRect={NSPoint=dd}{NSSize=dd}}") }
        }
    }

    static HIT_REGIONS: OnceLock<RwLock<HashMap<usize, Vec<Region>>>> = OnceLock::new();
    static SWIZZLED_CLASSES: OnceLock<Mutex<HashSet<usize>>> = OnceLock::new();

    fn hit_regions() -> &'static RwLock<HashMap<usize, Vec<Region>>> {
        HIT_REGIONS.get_or_init(|| RwLock::new(HashMap::new()))
    }

    fn swizzled_classes() -> &'static Mutex<HashSet<usize>> {
        SWIZZLED_CLASSES.get_or_init(|| Mutex::new(HashSet::new()))
    }

    /// swizzle 后的 hitTest: 实现。命中 Region 调原实现（经 itoppy_hitTest: 转发），否则返回 nil。
    unsafe extern "C" fn itoppy_hit_test(
        this: *mut Object,
        _cmd: Sel,
        point: NSPoint,
    ) -> *mut Object {
        unsafe {
            let window: *mut Object = msg_send![this, window];
            if !window.is_null() {
                let key = window as usize;
                let decision = hit_regions()
                    .read()
                    .ok()
                    .and_then(|guard| guard.get(&key).cloned())
                    .map(|regions| {
                        // hitTest 传入的是窗口基坐标（y 向上），Region 是窗口坐标（y 向下）。
                        let bounds: NSRect = msg_send![this, bounds];
                        let y_down = bounds.size.height - point.y;
                        regions.iter().any(|region| {
                            point.x >= region.x
                                && point.x <= region.x + region.w
                                && y_down >= region.y
                                && y_down <= region.y + region.h
                        })
                    });
                if let Some(false) = decision {
                    return std::ptr::null_mut();
                }
            }
            // 交换实现后 itoppy_hitTest: 指向原 hitTest: 实现。
            msg_send![this, itoppy_hitTest:point]
        }
    }

    /// 对 view 所属 class 懒式 swizzle 一次；任何一步失败都静默跳过，不影响窗口创建。
    unsafe fn swizzle_hit_test_class(view: *mut Object) {
        let class: *mut Class = (*view).class() as *const Class as *mut Class;
        if class.is_null() {
            return;
        }
        let already = swizzled_classes()
            .lock()
            .map(|mut classes| !classes.insert(class as usize))
            .unwrap_or(true);
        if already {
            return;
        }
        let original = class_getInstanceMethod(class, sel!(hitTest:));
        if original.is_null() {
            return;
        }
        let our_sel = Sel::register("itoppy_hitTest:");
        let added = class_addMethod(
            class,
            our_sel,
            std::mem::transmute::<
                unsafe extern "C" fn(*mut Object, Sel, NSPoint) -> *mut Object,
                Imp,
            >(itoppy_hit_test),
            b"@@:{NSPoint=dd}\0".as_ptr() as *const std::os::raw::c_char,
        );
        if !added {
            return;
        }
        let ours = class_getInstanceMethod(class, our_sel);
        if !ours.is_null() {
            method_exchangeImplementations(original as *mut _, ours as *mut _);
        }
    }

    fn window_key(window: &WebviewWindow) -> Option<usize> {
        window
            .ns_window()
            .ok()
            .map(|pointer| pointer as usize)
            .filter(|key| *key != 0)
    }

    pub fn update_impl(
        app: AppHandle,
        label: String,
        region: Option<Region>,
    ) -> Result<(), String> {
        let Some(window) = app.get_webview_window(&label) else {
            return Ok(());
        };
        let Some(key) = window_key(&window) else {
            return Ok(());
        };
        // AppKit 操作（swizzle 的首次安装）放主线程执行。
        app.run_on_main_thread(move || unsafe {
            let view: *mut Object = match window.ns_window().ok() {
                Some(ns_window) if !ns_window.is_null() => {
                    msg_send![ns_window as *mut Object, contentView]
                }
                _ => std::ptr::null_mut(),
            };
            if !view.is_null() {
                swizzle_hit_test_class(view);
            }
            if let Ok(mut guard) = hit_regions().write() {
                match region {
                    Some(region) => {
                        guard.insert(key, vec![region]);
                    }
                    None => {
                        guard.remove(&key);
                    }
                }
            }
        })
        .map_err(|error| error.to_string())
    }

    pub fn forget_window(app: &AppHandle, label: &str) {
        let Some(window) = app.get_webview_window(label) else {
            return;
        };
        if let Some(key) = window_key(&window) {
            if let Ok(mut guard) = hit_regions().write() {
                guard.remove(&key);
            }
        }
    }
}

#[cfg(not(target_os = "macos"))]
mod imp {
    use super::Region;
    use tauri::AppHandle;

    pub fn update_impl(
        _app: AppHandle,
        _label: String,
        _region: Option<Region>,
    ) -> Result<(), String> {
        Ok(())
    }

    pub fn forget_window(_app: &AppHandle, _label: &str) {}
}

#[tauri::command]
pub fn update_hit_region(
    app: AppHandle,
    label: String,
    region: Option<Region>,
) -> Result<(), String> {
    imp::update_impl(app, label, region)
}

pub use imp::forget_window;
