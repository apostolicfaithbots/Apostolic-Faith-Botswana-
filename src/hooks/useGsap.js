import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const elements = ref.current.querySelectorAll('.reveal')
    
    const observer = new IntersectionObserver(
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
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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
