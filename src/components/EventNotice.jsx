import { useState, useEffect, useMemo } from 'react'

export default function EventNotice({ events }) {
  const [now, setNow] = useState(new Date())
  const [dismissed, setDismissed] = useState(null)

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  const result = useMemo(() => {
    if (!events.length) return null

    for (const ev of events) {
      const start = new Date(ev.start_date + 'T00:00:00')
      const end = new Date(ev.end_date + 'T23:59:59')

      if (now >= start && now <= end) {
        const totalMs = end - start
        const elapsedMs = now - start
        const pct = totalMs > 0 ? (elapsedMs / totalMs) * 100 : 100

        let status = 'Started'
        if (pct >= 85) status = 'Almost Done'
        else if (pct >= 50) status = 'Ongoing'

        return { event: ev, status, pct, isLive: true, countdown: null }
      }
    }

    const upcoming = events.filter(ev => new Date(ev.start_date + 'T00:00:00') > now)
    if (upcoming.length === 0) return null
    const next = upcoming[0]
    const target = new Date(next.start_date + 'T00:00:00')
    const diff = target - now
    const days = Math.floor(diff / 86400000)
    const hrs = Math.floor((diff % 86400000) / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    const secs = Math.floor((diff % 60000) / 1000)

    let countdown
    if (days > 0) countdown = `${days}d ${hrs}h ${mins}m`
    else if (hrs > 0) countdown = `${hrs}h ${mins}m ${secs}s`
    else countdown = `${mins}m ${secs}s`

    return { event: next, status: 'Upcoming', pct: 0, isLive: false, countdown }
  }, [events, now])

  if (!result || dismissed === result.event.id) return null

  const { event, status, pct, isLive, countdown } = result

  const statusColors = {
    'Upcoming': { bg: 'var(--color-gray-900)', accent: 'var(--color-gold)' },
    'Started': { bg: 'var(--color-red)', accent: '#fff' },
    'Ongoing': { bg: 'var(--color-red-dark)', accent: 'var(--color-gold-light)' },
    'Almost Done': { bg: '#7B341E', accent: 'var(--color-gold-light)' },
  }
  const colors = statusColors[status] || statusColors['Upcoming']

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 900,
      maxWidth: '400px', width: 'calc(100% - 3rem)',
      background: colors.bg, color: '#fff', borderRadius: '8px',
      padding: '1.25rem 1.5rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      animation: 'noticeSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <button onClick={() => setDismissed(event.id)} style={{
        position: 'absolute', top: '0.5rem', right: '0.75rem',
        color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', lineHeight: 1,
        background: 'none', border: 'none', cursor: 'pointer',
      }} aria-label="Dismiss">&times;</button>

      {/* Status badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        marginBottom: '0.6rem', padding: '0.2rem 0.6rem',
        background: 'rgba(255,255,255,0.15)', borderRadius: '20px',
        fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700,
      }}>
        {isLive && <span style={{
          width: '6px', height: '6px', borderRadius: '50%', background: '#fff',
          animation: 'noticePulse 1.5s infinite',
        }} />}
        {status}
      </div>

      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 500,
        marginBottom: '0.25rem', lineHeight: 1.3,
      }}>{event.title}</div>

      <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.6rem' }}>
        {event.location}
      </div>

      {/* Progress bar for live events */}
      {isLive && (
        <div style={{
          width: '100%', height: '3px', background: 'rgba(255,255,255,0.15)',
          borderRadius: '2px', marginBottom: '0.4rem', overflow: 'hidden',
        }}>
          <div style={{
            width: `${Math.min(pct, 100)}%`, height: '100%',
            background: colors.accent, borderRadius: '2px',
            transition: 'width 1s linear',
          }} />
        </div>
      )}

      {/* Countdown for upcoming */}
      {!isLive && countdown && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700,
          color: colors.accent, letterSpacing: '0.04em',
        }}>{countdown}</div>
      )}

      {isLive && (
        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>
          {Math.round(pct)}% complete
        </div>
      )}

      <style>{`
        @keyframes noticeSlide { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes noticePulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>
    </div>
  )
}
