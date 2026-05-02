import { vi } from 'vitest'

export function createMockLocalStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(k => delete store[k])
    }),
    _store: store,
  }
}

export function createMockIntersectionObserver() {
  const observers = new Map<Element, IntersectionObserverCallback>()
  
  return {
    observe: vi.fn((element: Element, callback: IntersectionObserverCallback) => {
      observers.set(element, callback)
    }),
    unobserve: vi.fn((element: Element) => {
      observers.delete(element)
    }),
    disconnect: vi.fn(() => {
      observers.clear()
    }),
    _trigger: (element: Element, isIntersecting: boolean) => {
      const callback = observers.get(element)
      if (callback) {
        callback(
          [{ isIntersecting, target: element } as IntersectionObserverEntry],
          {} as IntersectionObserver
        )
      }
    },
  }
}
