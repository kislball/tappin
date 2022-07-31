export interface Room {
  /** Emits event in this room */
  emit<
    T extends Record<string, unknown> = Record<string, unknown>,
    E extends keyof T = keyof T,
  >(name: E, data: T[E]): Promise<void>;
}
