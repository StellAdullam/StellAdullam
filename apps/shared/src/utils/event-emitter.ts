/**
 * Lightweight, zero-dependency, strongly-typed event emitter for reactive client-side notifications.
 */

export type EventListener<T = unknown> = (data: T) => void | Promise<void>;

export class TypedEventEmitter<Events extends Record<string, unknown>> {
  private listeners: Map<keyof Events, Set<EventListener<never>>> = new Map();

  public on<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>,
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as unknown as EventListener<never>);

    return () => this.off(event, listener);
  }

  public off<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>,
  ): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener as unknown as EventListener<never>);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  public emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const set = this.listeners.get(event);
    if (set) {
      for (const listener of set) {
        try {
          (listener as unknown as EventListener<Events[K]>)(data);
        } catch (error) {
          console.error(
            `[TypedEventEmitter] Error handling event "${String(event)}":`,
            error,
          );
        }
      }
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
