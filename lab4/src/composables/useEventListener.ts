import { onMounted, onUnmounted } from 'vue'

type MaybeRef<T> = T | (() => T)

export function useEventListener<K extends keyof WindowEventMap>(
  target: MaybeRef<Window | Document | HTMLElement | EventTarget>,
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  let resolvedTarget: Window | Document | HTMLElement | EventTarget | null = null

  const getTarget = () => (typeof target === 'function' ? target() : target)

  onMounted(() => {
    resolvedTarget = getTarget()
    resolvedTarget?.addEventListener(event, handler as EventListener, options)
  })

  onUnmounted(() => {
    resolvedTarget?.removeEventListener(event, handler as EventListener, options)
    resolvedTarget = null
  })

  // optional manual stop
  const stop = () => {
    resolvedTarget?.removeEventListener(event, handler as EventListener, options)
    resolvedTarget = null
  }

  return { stop }
}