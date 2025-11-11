import { ref, computed, onMounted } from 'vue'
import { useEventListener } from './useEventListener'

export type Breakpoints = Record<string, number>

const DEFAULT_BREAKPOINTS: Breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
}

export function useBreakpoints(custom?: Breakpoints) {
  const bps = ref<Breakpoints>({ ...(custom || DEFAULT_BREAKPOINTS) })

  const width = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 0)

  const updateWidth = () => {
    width.value = typeof window !== 'undefined' ? window.innerWidth : 0
  }

  onMounted(updateWidth)
  useEventListener(() => window, 'resize', () => updateWidth())

  const isMobile = computed(() => width.value < (bps.value.mobile ?? DEFAULT_BREAKPOINTS.mobile))
  const isTablet = computed(() => width.value >= (bps.value.mobile ?? DEFAULT_BREAKPOINTS.mobile) && width.value < (bps.value.tablet ?? DEFAULT_BREAKPOINTS.tablet))
  const isDesktop = computed(() => width.value >= (bps.value.tablet ?? DEFAULT_BREAKPOINTS.tablet))

  function greater(name: keyof Breakpoints) {
    return computed(() => width.value >= (bps.value[name as string] ?? 0))
  }

  function smaller(name: keyof Breakpoints) {
    return computed(() => width.value < (bps.value[name as string] ?? 0))
  }

  function between(min: keyof Breakpoints, max: keyof Breakpoints) {
    return computed(() => {
      const minVal = bps.value[min as string] ?? 0
      const maxVal = bps.value[max as string] ?? Number.POSITIVE_INFINITY
      return width.value >= minVal && width.value < maxVal
    })
  }

  function setBreakpoints(next: Breakpoints) {
    bps.value = { ...bps.value, ...next }
  }

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    greater,
    smaller,
    between,
    setBreakpoints,
    breakpoints: bps,
  }
}