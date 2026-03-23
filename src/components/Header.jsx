import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi'

const basePath = import.meta.env.BASE_URL

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const isHome = location.pathname === '/'

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: scrolled ? '0.75rem 0' : '1.25rem 0',
      background: scrolled ? 'rgba(26, 26, 26, 0.95)' : (isHome ? 'transparent' : 'rgba(26, 26, 26, 0.95)'),
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 4vw, 3rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <img 
            src={`${basePath}images/logo.jpg`}
            alt="Apostolic Faith Botswana"
            style={{
              height: scrolled ? '36px' : '44px',
              width: 'auto',
              borderRadius: '4px',
              transition: 'height 0.4s ease',
            }}
          />
          <div style={{ color: '#fff' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: scrolled ? '1rem' : '1.15rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              transition: 'font-size 0.4s ease',
            }}>
              Apostolic Faith
            </div>
            <div style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.7,
              fontWeight: 500,
            }}>
              Botswana
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }} className="desktop-nav">
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/events', label: 'Events' },
            { to: '/live', label: 'Live' },
            { to: '/contact', label: 'Contact' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              color: location.pathname === to ? 'var(--color-gold)' : 'rgba(255,255,255,0.8)',
              fontSize: '0.82rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 500,
              transition: 'color 0.3s ease',
              position: 'relative',
            }}>
              {label}
            </Link>
          ))}
          <Link to="/live" style={{
            padding: '0.6rem 1.5rem',
            background: 'var(--color-red)',
            color: '#fff',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
            borderRadius: '2px',
            transition: 'background 0.3s ease',
          }}>
            Watch Live
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            padding: '0.5rem',
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '320px',
        background: 'var(--color-gray-900)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '5rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        zIndex: 999,
      }}>
        {[
          { to: '/', label: 'Home' },
          { to: '/about', label: 'About' },
          { to: '/events', label: 'Events' },
          { to: '/live', label: 'Live Services' },
          { to: '/contact', label: 'Contact' },
          { to: '/admin', label: 'Admin' },
        ].map(({ to, label }) => (
          <Link key={to} to={to} style={{
            color: location.pathname === to ? 'var(--color-gold)' : 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            fontFamily: 'var(--font-display)',
            padding: '0.75rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            transition: 'color 0.3s',
          }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div 
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
          }}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  )
}
