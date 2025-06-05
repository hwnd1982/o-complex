export function Singleton<T>(this: { instance?: T}, instance: T): T {
  if (!this.instance) {
      this.instance = instance;
  }

  return this.instance;
}
