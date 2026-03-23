import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useGsap'

const CHANNEL_ID = 'UCi-ZVmGeaBSR4FkPDMuQ5IA'

export default function LivePage() {
  const revealRef = useScrollReveal()
  const [liveVideoId, setLiveVideoId] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Try to find a current live stream by checking the channel's live page
    // We use the /live URL which redirects to the active stream
    // The embed with channel ID will work when live
    const checkLive = async () => {
      try {
        // Attempt to load the live embed - if the channel is live, this works
        // We'll use the channel's live URL format
        setLiveVideoId(null)
      } catch {
        setLiveVideoId(null)
      } finally {
        setChecking(false)
      }
    }
    checkLive()

    // Re-check every 2 minutes
    const interval = setInterval(checkLive, 120000)
    return () => clearInterval(interval)
  }, [])

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

      {/* Video Section */}
      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>

          {/* YouTube Embed - uses channel live URL */}
          <div className="reveal" style={{
            position: 'relative', paddingBottom: '56.25%', height: 0,
            borderRadius: '6px', overflow: 'hidden', background: '#000',
            marginBottom: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <iframe
              src={`https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="Live Stream"
            />
          </div>

          {/* Offline message overlay */}
          <div className="reveal" data-delay="0.1" style={{
            background: '#fff', padding: '1.5rem 2rem', borderRadius: '4px',
            border: '1px solid var(--color-gray-200)', marginBottom: '3rem',
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: isServiceTime() ? '#4CAF50' : 'var(--color-gray-400)',
              animation: isServiceTime() ? 'liveDot 1.5s infinite' : 'none',
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-black)', marginBottom: '0.15rem' }}>
                {isServiceTime() ? 'Service may be live now' : 'Stream will appear when we go live'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-gray-500)' }}>
                {isServiceTime()
                  ? 'If the video above shows an error, try refreshing the page.'
                  : 'Every Sunday at 09:00 AM and 10:30 AM (CAT). The video player above will automatically play when the stream begins.'
                }
              </div>
            </div>
            <a href={`https://www.youtube.com/channel/${CHANNEL_ID}/live`}
              target="_blank" rel="noopener noreferrer"
              style={{
                padding: '0.5rem 1rem', background: 'var(--color-red)', color: '#fff',
                fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                fontWeight: 600, borderRadius: '2px', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
              Open on YouTube
            </a>
          </div>

          {/* Service Info Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem', marginBottom: '3rem',
          }}>
            {[
              { title: 'Sunday School', time: '09:00 AM CAT', desc: 'Bible study and discussion for all ages.' },
              { title: 'Devotional Service', time: '10:30 AM CAT', desc: 'Worship, testimonies, and the preaching of the Word.' },
            ].map((service, i) => (
              <div key={i} className="reveal" data-delay={i * 0.1} style={{
                background: '#fff', padding: '2rem', borderRadius: '4px', border: '1px solid var(--color-gray-200)',
              }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-red)', marginBottom: '0.5rem' }}>Every Sunday</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-black)', marginBottom: '0.35rem' }}>{service.title}</h3>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-gold-dark)', marginBottom: '0.5rem' }}>{service.time}</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{service.desc}</p>
              </div>
            ))}
          </div>

          {/* Ways to Connect */}
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
                  transition: 'all 0.3s',
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

      <style>{`@keyframes liveDot { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}

// Check if current time is near service hours (Sunday 8:30-13:00 CAT)
function isServiceTime() {
  const now = new Date()
  // Convert to CAT (UTC+2)
  const catOffset = 2 * 60 // minutes
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes()
  const catMinutes = utcMinutes + catOffset
  const catHour = Math.floor(catMinutes / 60) % 24
  const catDay = now.getUTCDay()

  // Sunday = 0, service window roughly 8:30 AM to 1:00 PM CAT
  return catDay === 0 && catHour >= 8 && catHour < 13
}
