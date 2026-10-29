import { createHash } from "node:crypto";
import { access, readdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { AgentReadHost, ReadDirectoryEntry } from "../core/agents/host.js";

export class NodeReadHost implements AgentReadHost {
  homeDirectory(): string {
    return homedir();
  }

  environmentVariable(name: string): string | undefined {
    return process.env[name];
  }

  joinPath(...parts: string[]): string {
    return join(...parts);
  }

  async pathExists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  async readDirectory(path: string): Promise<ReadDirectoryEntry[]> {
    const entries = await readdir(path, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      path: this.joinPath(path, entry.name),
      isDirectory: entry.isDirectory(),
    }));
  }

  readTextFile(path: string): Promise<string> {
    return readFile(path, "utf8");
  }

  md5(value: string): string {
    return createHash("md5").update(value, "utf8").digest("hex");
  }
}
