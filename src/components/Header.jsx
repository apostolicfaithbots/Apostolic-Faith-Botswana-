import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi'

const basePath = import.meta.env.BASE_URL

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isHome = location.pathname === '/'
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/events', label: 'Events' },
    { to: '/sermons', label: 'Sermons' },
    { to: '/lessons', label: 'Lessons' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '0.6rem 0' : '1rem 0',
        background: (scrolled || menuOpen) ? 'rgba(26,26,26,0.98)' : (isHome ? 'transparent' : 'rgba(26,26,26,0.96)'),
        backdropFilter: (scrolled || menuOpen) ? 'blur(20px)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1.5rem,4vw,3rem)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={`${basePath}images/logo.jpg`} alt="" style={{ height: scrolled ? '34px' : '42px', borderRadius: '4px', transition: 'height 0.4s' }} />
            <div style={{ color: '#fff' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: scrolled ? '0.95rem' : '1.1rem', fontWeight: 500, lineHeight: 1.2, transition: 'font-size 0.4s' }}>Apostolic Faith</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, fontWeight: 500 }}>Botswana</div>
            </div>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                color: location.pathname === to ? 'var(--color-gold)' : 'rgba(255,255,255,0.75)',
                fontSize: '0.76rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, transition: 'color 0.3s',
              }}>{label}</Link>
            ))}
            <Link to="/live" style={{
              padding: '0.5rem 1.2rem', background: 'var(--color-red)', color: '#fff',
              fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '2px',
            }}>Watch Live</Link>
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
            style={{ display: 'none', color: '#fff', fontSize: '1.5rem', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1102 }}
            aria-label="Menu">
            {menuOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>
      </header>

      {/* Mobile menu rendered via portal so it's outside the header stacking context */}
      {createPortal(
        <>
          {/* Backdrop */}
          <div onClick={() => setMenuOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            background: 'rgba(0,0,0,0.6)',
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
            transition: 'opacity 0.35s ease',
          }} />

          {/* Drawer */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '100%', maxWidth: '300px',
            background: '#1F2022',
            zIndex: 1101,
            transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            padding: '5rem 2rem 2rem',
            display: 'flex', flexDirection: 'column', gap: '0.15rem',
            overflowY: 'auto',
          }}>
            {[...navLinks, { to: '/live', label: 'Live Services' }, { to: '/admin', label: 'Admin' }].map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{
                color: location.pathname === to ? 'var(--color-gold)' : 'rgba(255,255,255,0.65)',
                fontSize: '1.05rem', fontFamily: 'var(--font-display)',
                padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                textDecoration: 'none',
              }}>{label}</Link>
            ))}
          </div>
        </>,
        document.body
      )}

      <style>{`
        @media (max-width: 900px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: block !important; } }
      `}</style>
    </>
  )
}
