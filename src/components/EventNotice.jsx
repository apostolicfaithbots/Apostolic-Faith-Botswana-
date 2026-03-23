import { useState, useMemo } from 'react'
import LiveCountdown, { useNow } from './LiveCountdown'

export default function EventNotice({ events }) {
  const now = useNow(1000)
  const [dismissed, setDismissed] = useState(null)

  const result = useMemo(() => {
    if (!events.length) return null

    for (const ev of events) {
      const start = new Date(ev.start_date + 'T00:00:00')
      const end = new Date(ev.end_date + 'T23:59:59')
      if (now >= start && now <= end) {
        const total = end - start
        const elapsed = now - start
        const pct = total > 0 ? Math.min((elapsed / total) * 100, 100) : 100
        let status = 'Started'
        if (pct >= 85) status = 'Almost Done'
        else if (pct >= 50) status = 'Ongoing'
        return { event: ev, status, pct, isLive: true }
      }
    }

    const upcoming = events.filter(ev => new Date(ev.start_date + 'T00:00:00') > now)
    if (!upcoming.length) return null
    return { event: upcoming[0], status: 'Upcoming', pct: 0, isLive: false }
  }, [events, now])

  if (!result || dismissed === result.event.id) return null
  const { event, status, pct, isLive } = result

  const statusColors = {
    'Upcoming': 'var(--color-gray-900)',
    'Started': 'var(--color-red)',
    'Ongoing': 'var(--color-red-dark)',
    'Almost Done': '#7B341E',
  }

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 900,
      maxWidth: '400px', width: 'calc(100% - 3rem)',
      background: statusColors[status] || 'var(--color-gray-900)', color: '#fff',
      borderRadius: '8px', padding: '1.25rem 1.5rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      animation: 'noticeSlide 0.6s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <button onClick={() => setDismissed(event.id)} style={{
        position: 'absolute', top: '0.5rem', right: '0.75rem',
        color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', lineHeight: 1,
        background: 'none', border: 'none', cursor: 'pointer',
      }}>&times;</button>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        marginBottom: '0.6rem', padding: '0.2rem 0.6rem',
        background: 'rgba(255,255,255,0.15)', borderRadius: '20px',
        fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700,
      }}>
        {isLive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'noticePulse 1.5s infinite' }} />}
        {status}
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 500, marginBottom: '0.2rem', lineHeight: 1.3, paddingRight: '1.5rem' }}>
        {event.title}
      </div>
      <div style={{ fontSize: '0.78rem', opacity: 0.8, marginBottom: '0.75rem' }}>{event.location}</div>

      {isLive && (
        <>
          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', marginBottom: '0.35rem', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-gold)', borderRadius: '2px', transition: 'width 1s linear' }} />
          </div>
          <div style={{ fontSize: '0.68rem', opacity: 0.6 }}>{Math.round(pct)}% complete</div>
        </>
      )}

      {!isLive && (
        <LiveCountdown targetDate={new Date(event.start_date + 'T00:00:00')} now={now} size="sm" light />
      )}

      <style>{`
        @keyframes noticeSlide { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes noticePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}
