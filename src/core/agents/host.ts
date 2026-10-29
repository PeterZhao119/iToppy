export interface ReadDirectoryEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

export interface AgentReadHost {
  homeDirectory(): string;
  environmentVariable(name: string): string | undefined;
  joinPath(...parts: string[]): string;
  pathExists(path: string): Promise<boolean>;
  readDirectory(path: string): Promise<ReadDirectoryEntry[]>;
  readTextFile(path: string, maxBytes?: number): Promise<string>;
  md5(value: string): string;
}
