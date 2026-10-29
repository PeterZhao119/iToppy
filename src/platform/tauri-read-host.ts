import { invoke } from "@tauri-apps/api/core";
import type { AgentReadHost, ReadDirectoryEntry } from "../core/agents/host.js";

export class TauriReadHost implements AgentReadHost {
  constructor(
    private readonly home: string,
    private readonly kimiHome: string,
    private readonly codexHome: string,
  ) {}

  homeDirectory(): string {
    return this.home;
  }

  environmentVariable(name: string): string | undefined {
    if (name === "KIMI_CODE_HOME") return this.kimiHome;
    if (name === "CODEX_HOME") return this.codexHome;
    return undefined;
  }

  joinPath(...parts: string[]): string {
    return parts.join("/").replace(/\/+/g, "/");
  }

  pathExists(path: string): Promise<boolean> {
    return invoke<boolean>("path_exists", { path });
  }

  readDirectory(path: string): Promise<ReadDirectoryEntry[]> {
    return invoke<ReadDirectoryEntry[]>("read_directory", { path });
  }

  readTextFile(path: string, maxBytes?: number): Promise<string> {
    return invoke<string>("read_text_file", { path, maxBytes });
  }

  md5(): string {
    throw new Error("MD5 is not available in the native read host.");
  }
}
