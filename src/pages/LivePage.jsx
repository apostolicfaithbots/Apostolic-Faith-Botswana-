import { useState, useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useGsap'

const CHANNEL_ID = 'UCi-ZVmGeaBSR4FkPDMuQ5IA'
const basePath = import.meta.env.BASE_URL

export default function LivePage() {
  const revealRef = useScrollReveal()
  const [isLive, setIsLive] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const iframeRef = useRef(null)

  // Try to detect if channel is live by loading the embed in a hidden iframe
  // and checking if it errors out
  useEffect(() => {
    // On Sundays near service time, auto-attempt to show the player
    if (isServiceTime()) {
      setShowPlayer(true)
    }

    // Also allow manual "check now" via button
  }, [])

  const handleGoLive = () => {
    setShowPlayer(true)
  }

  return (
    <div ref={revealRef}>
      {/* Header */}
      <section style={{ background: 'var(--color-gray-900)', color: '#fff', padding: '8rem 0 4rem' }}>
        <div className="container">
          <div className="reveal" style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1rem' }}>Worship With Us</div>
          <h1 className="reveal" data-delay="0.1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 400, marginBottom: '1rem' }}>Live Services</h1>
          <p className="reveal" data-delay="0.2" style={{ fontSize: '1.05rem', opacity: 0.7, maxWidth: '550px' }}>
            Join us every Sunday for Sunday School at 09:00 AM and Devotional Service at 10:30 AM (CAT).
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>

          {/* Video area */}
          <div className="reveal" style={{
            position: 'relative', paddingBottom: '56.25%', height: 0,
            borderRadius: '6px', overflow: 'hidden',
            marginBottom: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          }}>
            {showPlayer ? (
              /* YouTube embed - shown when user clicks or during service time */
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title="Live Stream"
              />
            ) : (
              /* Custom offline state */
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'var(--color-gray-900)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: '#fff', textAlign: 'center', padding: '2rem',
              }}>
                {/* Church image as subtle background */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${basePath}images/church-front.jpg)`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  opacity: 0.1,
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Play circle icon */}
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}>
                    <div style={{
                      width: 0, height: 0,
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderLeft: '20px solid rgba(255,255,255,0.5)',
                      marginLeft: '4px',
                    }} />
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                    fontWeight: 400, marginBottom: '0.5rem',
                  }}>
                    We Are Currently Offline
                  </div>
                  <div style={{
                    fontSize: '0.9rem', opacity: 0.6, maxWidth: '380px', lineHeight: 1.6,
                    marginBottom: '1.5rem',
                  }}>
                    Our next service is Sunday at 09:00 AM (CAT). The stream will begin automatically when we go live.
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={handleGoLive} style={{
                      padding: '0.65rem 1.5rem', background: 'var(--color-red)', color: '#fff',
                      fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                      fontWeight: 600, borderRadius: '2px', border: 'none', cursor: 'pointer',
                    }}>
                      Check Live Stream
                    </button>
                    <a href={`https://www.youtube.com/channel/${CHANNEL_ID}/live`}
                      target="_blank" rel="noopener noreferrer" style={{
                        padding: '0.65rem 1.5rem',
                        border: '1px solid rgba(255,255,255,0.25)', color: '#fff',
                        fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                        fontWeight: 600, borderRadius: '2px',
                      }}>
                      Open YouTube
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Back to offline button when player is showing */}
          {showPlayer && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <button onClick={() => setShowPlayer(false)} style={{
                fontSize: '0.78rem', color: 'var(--color-gray-500)', background: 'none',
                border: 'none', cursor: 'pointer', textDecoration: 'underline',
              }}>
                Not seeing a stream? Go back to offline view
              </button>
            </div>
          )}

          {/* Service time indicator */}
          <div className="reveal" data-delay="0.1" style={{
            background: '#fff', padding: '1.25rem 1.5rem', borderRadius: '4px',
            border: '1px solid var(--color-gray-200)', marginBottom: '3rem',
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: isServiceTime() ? '#4CAF50' : 'var(--color-gray-300)',
              animation: isServiceTime() ? 'liveDot 1.5s infinite' : 'none',
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-black)' }}>
                {isServiceTime() ? 'Service time -- we may be live now' : 'Next service: Sunday'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-gray-500)' }}>
                Sunday School 09:00 AM &middot; Devotional 10:30 AM (CAT)
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem', marginBottom: '3rem',
          }}>
            {[
              { title: 'Sunday School', time: '09:00 AM CAT', desc: 'Bible study and discussion for all ages.' },
              { title: 'Devotional Service', time: '10:30 AM CAT', desc: 'Worship, testimonies, and the preaching of the Word.' },
            ].map((svc, i) => (
              <div key={i} className="reveal" data-delay={i * 0.1} style={{
                background: '#fff', padding: '2rem', borderRadius: '4px', border: '1px solid var(--color-gray-200)',
              }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-red)', marginBottom: '0.5rem' }}>Every Sunday</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-black)', marginBottom: '0.35rem' }}>{svc.title}</h3>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-gold-dark)', marginBottom: '0.5rem' }}>{svc.time}</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{svc.desc}</p>
              </div>
            ))}
          </div>

          {/* Connect Links */}
          <div className="reveal" data-delay="0.1">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-black)', marginBottom: '1.5rem', textAlign: 'center' }}>Ways to Connect</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {[
                { platform: 'Zoom', detail: 'Meeting ID: 848 7445 7626 | Passcode: 1111', href: 'https://us02web.zoom.us/j/84874457626?pwd=c2tYblRuWWEvYzZrYXFKYStyUTMvdz09', color: '#2D8CFF' },
                { platform: 'YouTube', detail: 'Watch live and previous services', href: `https://www.youtube.com/channel/${CHANNEL_ID}`, color: '#FF0000' },
                { platform: 'Facebook', detail: 'Follow us for updates and live streams', href: 'https://www.facebook.com/share/1YAWfu9SCg/', color: '#1877F2' },
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" style={{
                  display: 'block', background: '#fff', padding: '1.5rem',
                  borderRadius: '4px', border: '1px solid var(--color-gray-200)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-black)' }}>{item.platform}</h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', lineHeight: 1.5 }}>{item.detail}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`@keyframes liveDot{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  )
}

function isServiceTime() {
  const now = new Date()
  const catOffset = 2 * 60
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes()
  const catMinutes = utcMinutes + catOffset
  const catHour = Math.floor(catMinutes / 60) % 24
  const catDay = now.getUTCDay()
  return catDay === 0 && catHour >= 8 && catHour < 13
}
