import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

export function useScrollReveal() {
  const ref = useRef(null)
  const observerRef = useRef(null)

  const setupObserver = useCallback(() => {
    if (!ref.current) return

    // Clean up previous observer
    if (observerRef.current) observerRef.current.disconnect()

    const elements = ref.current.querySelectorAll('.reveal')
    if (elements.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              delay: parseFloat(entry.target.dataset.delay || 0),
            })
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )

    elements.forEach((el) => {
      // Only observe elements that haven't been revealed yet
      if (getComputedStyle(el).opacity === '0' || el.style.opacity === '0' || el.classList.contains('reveal')) {
        observerRef.current.observe(el)
      }
    })
  }, [])

  useEffect(() => {
    if (!ref.current) return

    // Initial setup with a small delay to let first render complete
    const initialTimeout = setTimeout(setupObserver, 50)

    // Watch for new .reveal elements being added (from async data)
    const mutationObserver = new MutationObserver(() => {
      // Debounce: wait a tick for batch DOM updates to finish
      setTimeout(setupObserver, 30)
    })

    mutationObserver.observe(ref.current, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(initialTimeout)
      mutationObserver.disconnect()
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [setupObserver])

  return ref
}

export function useParallax(speed = 0.3) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const handleScroll = () => {
      const scrolled = window.scrollY
      const rect = ref.current.getBoundingClientRect()
      const elementTop = rect.top + scrolled
      const offset = (scrolled - elementTop) * speed

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        gsap.set(ref.current, { y: offset })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return ref
}
