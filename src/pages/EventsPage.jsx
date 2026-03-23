import { useState, useMemo, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useGsap'
import { format, parseISO } from 'date-fns'

const typeColors = { camp:'#C9A84C', revival:'#B8282E', service:'#4A7C59', celebration:'#6B4FA0', training:'#3A6B9F', meeting:'#636568' }

export default function EventsPage({ events }) {
  const revealRef = useScrollReveal()
  const [filter, setFilter] = useState('all')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  const types = ['all', 'camp', 'revival', 'service', 'celebration', 'training', 'meeting']

  // Group events by month
  const grouped = useMemo(() => {
    const filtered = filter === 'all' ? events : events.filter(e => e.type === filter)
    const map = {}
    filtered.forEach(e => {
      const key = format(parseISO(e.start_date), 'MMMM yyyy')
      if (!map[key]) map[key] = []
      map[key].push(e)
    })
    return map
  }, [events, filter])

  return (
    <div ref={revealRef}>
      <section style={{ background: 'var(--color-gray-900)', color: '#fff', padding: '8rem 0 4rem' }}>
        <div className="container">
          <div className="reveal" style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1rem' }}>2026 Calendar</div>
          <h1 className="reveal" data-delay="0.1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 400, marginBottom: '1rem' }}>Events & Activities</h1>
          <p className="reveal" data-delay="0.2" style={{ fontSize: '1.05rem', opacity: 0.7, maxWidth: '550px' }}>
            Revivals, camps, celebrations, and services throughout the year.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-200)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '0.35rem 0.9rem', fontSize: '0.73rem', textTransform: 'capitalize', fontWeight: 500,
              borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s',
              background: filter === t ? 'var(--color-gray-900)' : 'transparent',
              color: filter === t ? '#fff' : 'var(--color-gray-600)',
              border: `1px solid ${filter === t ? 'var(--color-gray-900)' : 'var(--color-gray-300)'}`,
            }}>{t === 'all' ? 'All' : t}</button>
          ))}
        </div>
      </section>

      {/* Events by month */}
      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          {Object.keys(grouped).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-400)' }}>No events found.</div>
          ) : (
            Object.entries(grouped).map(([month, evts]) => (
              <div key={month} style={{ marginBottom: '3rem' }}>
                <h2 className="reveal" style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-black)',
                  marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-gray-200)',
                }}>{month}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                  {evts.map((ev, i) => (
                    <EventCard key={ev.id} event={ev} now={now} delay={Math.min(i * 0.06, 0.3)} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function EventCard({ event, now, delay }) {
  const start = new Date(event.start_date + 'T00:00:00')
  const end = new Date(event.end_date + 'T23:59:59')
  const isLive = now >= start && now <= end
  const isPast = now > end
  const isUpcoming = now < start

  // Countdown
  let countdown = null
  if (isUpcoming) {
    const diff = start - now
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    if (d > 14) countdown = `${d} days`
    else if (d > 0) countdown = `${d}d ${h}h`
    else if (h > 0) countdown = `${h}h ${m}m ${s}s`
    else countdown = `${m}m ${s}s`
  }

  // Progress for live
  let pct = 0
  if (isLive) {
    const total = end - start
    pct = Math.min(((now - start) / total) * 100, 100)
  }

  const color = typeColors[event.type] || '#636568'

  return (
    <div className="reveal" data-delay={delay} style={{
      background: isPast ? 'var(--color-gray-100)' : '#fff',
      border: isLive ? `2px solid var(--color-red)` : '1px solid var(--color-gray-200)',
      borderRadius: '6px', padding: '1.5rem', position: 'relative',
      opacity: isPast ? 0.5 : 1, transition: 'all 0.3s',
    }}>
      {/* Live badge */}
      {isLive && (
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          background: 'var(--color-red)', color: '#fff',
          padding: '0.2rem 0.6rem', borderRadius: '20px',
          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', animation: 'evPulse 1.5s infinite' }} />
          Live
        </div>
      )}

      {/* Type tag */}
      <span style={{
        display: 'inline-block', padding: '0.15rem 0.5rem', background: color, color: '#fff',
        fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '2px', marginBottom: '0.75rem',
      }}>{event.type}</span>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-black)', marginBottom: '0.5rem', lineHeight: 1.2, paddingRight: isLive ? '4rem' : '0' }}>
        {event.title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.82rem', color: 'var(--color-gray-500)', marginBottom: isLive || isUpcoming ? '0.75rem' : 0 }}>
        <div>{format(parseISO(event.start_date), 'dd MMM yyyy')}{event.start_date !== event.end_date ? ` - ${format(parseISO(event.end_date), 'dd MMM yyyy')}` : ''}</div>
        <div>{event.location}</div>
        {event.responsibility && <div style={{ fontSize: '0.78rem', opacity: 0.7 }}>{event.responsibility}</div>}
      </div>

      {/* Live progress */}
      {isLive && (
        <div>
          <div style={{ width: '100%', height: '3px', background: 'var(--color-gray-200)', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.3rem' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-red)', borderRadius: '2px', transition: 'width 1s linear' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)' }}>{Math.round(pct)}% complete</div>
        </div>
      )}

      {/* Countdown */}
      {isUpcoming && countdown && (
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-gold-dark)', letterSpacing: '0.03em' }}>
          {countdown}
        </div>
      )}

      {isPast && (
        <div style={{ fontSize: '0.72rem', color: 'var(--color-gray-400)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.5rem' }}>Completed</div>
      )}

      <style>{`@keyframes evPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}
