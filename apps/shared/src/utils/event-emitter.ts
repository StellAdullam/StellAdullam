/**
 * Lightweight, zero-dependency, strongly-typed event emitter for reactive client-side notifications.
 */

export type EventListener<T = any> = (data: T) => void | Promise<void>;

export class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners: Map<keyof Events, Set<EventListener>> = new Map();

  public on<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    return () => this.off(event, listener);
  }

  public off<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener);
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
          listener(data);
        } catch (error) {
          console.error(`[TypedEventEmitter] Error handling event "${String(event)}":`, error);
        }
      }
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
