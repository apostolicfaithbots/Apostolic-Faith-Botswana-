import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'

const basePath = import.meta.env.BASE_URL

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-gray-900)',
      color: 'rgba(255,255,255,0.7)',
      padding: 'clamp(3rem, 6vw, 5rem) 0 2rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <img src={`${basePath}images/logo.jpg`} alt="" style={{ height: '40px', borderRadius: '4px' }} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  color: '#fff',
                  fontWeight: 500,
                }}>
                  Apostolic Faith
                </div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>
                  Botswana
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '280px' }}>
              Jesus The Light of The World. A Bible-believing church committed to upholding the Gospel of Jesus Christ.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--color-gold)',
              marginBottom: '1.25rem',
            }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { to: '/about', label: 'About Us' },
                { to: '/events', label: 'Events Calendar' },
                { to: '/live', label: 'Live Services' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} style={{ fontSize: '0.85rem', transition: 'color 0.3s' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Service Times */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--color-gold)',
              marginBottom: '1.25rem',
            }}>
              Service Times
            </h4>
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 500 }}>Sunday School</div>
                <div>09:00 AM (CAT)</div>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 500 }}>Devotional Service</div>
                <div>10:30 AM (CAT)</div>
              </div>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--color-gold)',
              marginBottom: '1.25rem',
            }}>
              Connect
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { icon: <FaFacebookF />, href: 'https://www.facebook.com/share/1YAWfu9SCg/' },
                { icon: <FaInstagram />, href: 'https://www.instagram.com/reel/C8j-lFioD_T/' },
                { icon: <FaTiktok />, href: 'https://vt.tiktok.com/ZSuPgHpJ5/' },
                { icon: <FaYoutube />, href: 'https://youtube.com/channel/UCi-ZVmGeaBSR4FkPDMuQ5IA' },
              ].map(({ icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s',
                  color: 'rgba(255,255,255,0.7)',
                }}>
                  {icon}
                </a>
              ))}
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              <div>Plot 54021, Phase 4</div>
              <div>Gaborone, Botswana</div>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
          opacity: 0.5,
        }}>
          <div>Apostolic Faith Mission of Portland, Oregon &mdash; Botswana</div>
          <div>&copy; {new Date().getFullYear()} All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
