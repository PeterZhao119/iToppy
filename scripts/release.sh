#!/bin/bash
# release.sh - Interactive release script for iToppy
# Bumps the version in every manifest, commits, tags, and pushes the tag.
# The pushed tag triggers .github/workflows/release.yml, which builds the
# macOS app and publishes it to GitHub Releases.
# Usage: ./scripts/release.sh

set -e

# Always run from the repository root, wherever the script is invoked from.
cd "$(dirname "$0")/.."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# Every file that carries the app version. Keep in sync with the
# "Verify version" step in .github/workflows/release.yml.
VERSION_FILES=(package.json package-lock.json src-tauri/tauri.conf.json src-tauri/Cargo.toml src-tauri/Cargo.lock)

# State
CURRENT_VERSION=""
NEW_VERSION=""

# ============================================================================
# Helper Functions
# ============================================================================

print_success() { echo -e "${GREEN}[✓]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }

# ============================================================================
# Main Functions
# ============================================================================

check_workdir() {
  echo -e "${BOLD}Step 1: Check${NC}"

  if [[ -n $(git status -s) ]]; then
    print_error "Working directory has uncommitted changes"
    git status -s
    exit 1
  fi
  print_success "Working directory clean"

  CURRENT_VERSION=$(node -p "require('./package.json').version")
  print_success "Current version: $CURRENT_VERSION"
  echo ""
}

select_version() {
  echo -e "${BOLD}Step 2: Select Version${NC}"

  # Drop any pre-release suffix (e.g. 0.2.0-beta.1 -> 0.2.0) before bumping.
  IFS='.' read -r major minor patch <<< "${CURRENT_VERSION%%-*}"
  local patch_ver="$major.$minor.$((patch + 1))"
  local minor_ver="$major.$((minor + 1)).0"
  local major_ver="$((major + 1)).0.0"

  echo "  1) patch  -> $patch_ver"
  echo "  2) minor  -> $minor_ver"
  echo "  3) major  -> $major_ver"
  echo "  4) custom (e.g. 0.2.0-beta.1, published as a pre-release)"
  echo ""
  read -r -p "Select [1-4]: " choice

  case "$choice" in
    1) NEW_VERSION="$patch_ver" ;;
    2) NEW_VERSION="$minor_ver" ;;
    3) NEW_VERSION="$major_ver" ;;
    4) read -r -p "Version: " NEW_VERSION ;;
    *) print_error "Invalid choice"; exit 1 ;;
  esac

  if [[ ! "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.]+)?$ ]]; then
    print_error "Not a valid semver version: $NEW_VERSION"
    exit 1
  fi
  if git rev-parse -q --verify "refs/tags/v$NEW_VERSION" > /dev/null; then
    print_error "Tag v$NEW_VERSION already exists"
    exit 1
  fi

  print_success "Selected: $CURRENT_VERSION -> $NEW_VERSION"
  echo ""
}

show_changes() {
  echo -e "${BOLD}Step 3: Changes${NC}"

  local last_tag notes
  last_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

  if [ -n "$last_tag" ]; then
    notes=$(git log "${last_tag}..HEAD" --pretty=format:"- %s" --no-merges)
    echo "Since $last_tag:"
  else
    notes=$(git log --pretty=format:"- %s" --no-merges -10)
    echo "Recent commits:"
  fi

  if [ -z "$notes" ]; then
    echo -e "  ${DIM}(no commits since last tag)${NC}"
  else
    echo "$notes" | head -15
  fi
  echo ""

  echo "  1) Continue"
  echo "  2) Abort"
  read -r -p "Select [1-2]: " choice
  if [[ "$choice" == "2" ]]; then
    echo "Aborted."
    exit 0
  fi
  echo ""
}

update_versions() {
  # package.json + package-lock.json
  npm version "$NEW_VERSION" --no-git-tag-version --allow-same-version > /dev/null

  # tauri.conf.json — replace only the top-level "version" line, keeping the
  # file's hand-written formatting intact.
  node -e '
    const fs = require("fs");
    const file = "src-tauri/tauri.conf.json";
    const text = fs.readFileSync(file, "utf8");
    fs.writeFileSync(file, text.replace(/("version":\s*")[^"]*(")/, `$1${process.argv[1]}$2`));
  ' "$NEW_VERSION"

  # Cargo.toml — replace only the first 'version = "..."' (under [package]).
  # Uses awk for cross-platform compatibility (BSD sed doesn't support 0,/pattern/ ranges).
  awk -v new="$NEW_VERSION" '
    done==0 && /^version = ".*"/ { sub(/"[^"]*"/, "\"" new "\""); done=1 }
    { print }
  ' src-tauri/Cargo.toml > src-tauri/Cargo.toml.tmp && mv src-tauri/Cargo.toml.tmp src-tauri/Cargo.toml

  # Cargo.lock — `cargo update --workspace` only refreshes the app's own entry
  # and never touches dependency versions.
  cargo update --workspace --quiet --manifest-path src-tauri/Cargo.toml

  # Hard-fail if any file did not pick up the new version.
  local tauri_ver cargo_ver
  tauri_ver=$(node -p "require('./src-tauri/tauri.conf.json').version")
  cargo_ver=$(grep -m1 '^version' src-tauri/Cargo.toml | sed 's/version = "\(.*\)"/\1/')
  if [[ "$(node -p "require('./package.json').version")" != "$NEW_VERSION" ]] \
    || [[ "$(node -p "require('./package-lock.json').version")" != "$NEW_VERSION" ]] \
    || [[ "$tauri_ver" != "$NEW_VERSION" ]] \
    || [[ "$cargo_ver" != "$NEW_VERSION" ]] \
    || ! grep -A1 '^name = "itoppy"$' src-tauri/Cargo.lock | grep -q "version = \"$NEW_VERSION\""; then
    print_error "Some version files were not updated to $NEW_VERSION — aborting before commit"
    git status -s
    exit 1
  fi
}

confirm_and_execute() {
  echo -e "${BOLD}Step 4: Confirm${NC}"
  echo -e "  Version: $CURRENT_VERSION -> ${BOLD}$NEW_VERSION${NC}"
  echo "  Tag:     v$NEW_VERSION"
  echo "  Files:   ${VERSION_FILES[*]}"
  echo "  Action:  Commit, tag, push to origin -> GitHub Actions builds and publishes the release"
  echo ""

  read -r -p "Type 'yes' to release: " response
  if [[ "$response" != "yes" ]]; then
    echo "Cancelled."
    exit 0
  fi

  echo ""
  echo -n "Updating version... "
  update_versions
  echo -e "${GREEN}OK${NC}"

  echo -n "Committing and tagging... "
  git add "${VERSION_FILES[@]}"
  git commit -m "chore: release v$NEW_VERSION" > /dev/null
  git tag "v$NEW_VERSION"
  echo -e "${GREEN}OK${NC}"

  local branch
  branch=$(git rev-parse --abbrev-ref HEAD)

  echo -n "Pushing branch ($branch)... "
  if ! git push origin "$branch" 2>&1; then
    echo -e "${RED}FAILED${NC}"
    echo ""
    echo "Manual recovery:"
    echo "  git push origin $branch"
    echo "  git push origin v$NEW_VERSION"
    exit 1
  fi
  echo -e "${GREEN}OK${NC}"

  echo -n "Pushing tag (triggers the release build)... "
  if ! git push origin "v$NEW_VERSION" 2>&1; then
    echo -e "${RED}FAILED${NC}"
    echo ""
    echo "Manual recovery:"
    echo "  git push origin v$NEW_VERSION"
    exit 1
  fi
  echo -e "${GREEN}OK${NC}"

  echo ""
  echo -e "${GREEN}Released v$NEW_VERSION${NC}"
  echo -e "${DIM}GitHub Actions will build the app and publish it to GitHub Releases.${NC}"
}

# ============================================================================
# Main
# ============================================================================

echo ""
echo -e "${BOLD}iToppy Release${NC}"
echo "──────────────"
echo ""

check_workdir
select_version
show_changes
confirm_and_execute
