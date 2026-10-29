export interface RegistrationOptions {
  override?: boolean;
}

export class ExtensionRegistry<T> {
  private readonly values = new Map<string, T>();

  register(id: string, value: T, options: RegistrationOptions = {}): void {
    if (this.values.has(id) && options.override !== true) {
      throw new Error(`Extension '${id}' is already registered. Pass override to replace it.`);
    }
    this.values.set(id, value);
  }

  get(id: string): T {
    const value = this.values.get(id);
    if (value === undefined) {
      throw new Error(`Extension '${id}' is not registered.`);
    }
    return value;
  }

  has(id: string): boolean {
    return this.values.has(id);
  }

  entries(): ReadonlyArray<readonly [string, T]> {
    return [...this.values.entries()];
  }
}
