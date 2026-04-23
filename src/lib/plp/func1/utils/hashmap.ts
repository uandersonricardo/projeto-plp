type Hashable = {
  hashCode(): number;
};

export class HashMap<K, V> {
  private hashed = new Map<number, [K, V]>();
  private fallback = new Map<K, V>();

  public set(key: K, value: V): void {
    if (this.isHashable(key)) {
      const hash = this.getHash(key);
      const entry = this.hashed.get(hash);

      if (entry) {
        entry[1] = value;
      } else {
        this.hashed.set(hash, [key, value]);
      }
    } else {
      this.fallback.set(key, value);
    }
  }

  public get(key: K): V | null {
    if (this.isHashable(key)) {
      return this.hashed.get(this.getHash(key))?.[1] ?? null;
    } else {
      return this.fallback.get(key) ?? null;
    }
  }

  public has(key: K): boolean {
    if (this.isHashable(key)) {
      return this.hashed.has(this.getHash(key));
    } else {
      return this.fallback.has(key);
    }
  }

  public *entries(): IterableIterator<[K, V]> {
    yield* this.hashed.values();
    yield* this.fallback.entries();
  }

  public forEach(callback: (value: V, key: K, map: HashMap<K, V>) => void): void {
    for (const [key, value] of this.entries()) {
      callback(value, key, this);
    }
  }

  private isHashable(key: any): key is Hashable {
    return key && typeof key.hashCode === "function";
  }

  private getHash(key: Hashable): number {
    return key.hashCode();
  }
}
