import { useState, useEffect, useMemo } from 'react'

export default function EventNotice({ events }) {
  const [now, setNow] = useState(new Date())
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const currentEvent = useMemo(() => {
    if (!events.length) return null
    
    return events.find(event => {
      const start = new Date(event.start_date + 'T00:00:00')
      const end = new Date(event.end_date + 'T23:59:59')
      return now >= start && now <= end
    })
  }, [events, now])

  const nextEvent = useMemo(() => {
    if (!events.length) return null
    
    const upcoming = events.filter(event => {
      const start = new Date(event.start_date + 'T00:00:00')
      return start > now
    })
    
    return upcoming.length > 0 ? upcoming[0] : null
  }, [events, now])

  const activeEvent = currentEvent || nextEvent
  if (!activeEvent || dismissed) return null

  const isLive = !!currentEvent
  const targetDate = isLive ? null : new Date(activeEvent.start_date + 'T00:00:00')
  
  let countdown = ''
  if (!isLive && targetDate) {
    const diff = targetDate - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const secs = Math.floor((diff % (1000 * 60)) / 1000)
    
    if (days > 0) countdown = `${days}d ${hours}h ${mins}m`
    else countdown = `${hours}h ${mins}m ${secs}s`
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 900,
      maxWidth: '380px',
      width: 'calc(100% - 3rem)',
      background: isLive ? 'var(--color-red)' : 'var(--color-gray-900)',
      color: '#fff',
      borderRadius: '8px',
      padding: '1.25rem 1.5rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <button 
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.75rem',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '1.2rem',
          lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        &times;
      </button>

      {isLive && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#fff',
            animation: 'pulse 1.5s infinite',
          }} />
          <span style={{
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Happening Now
          </span>
        </div>
      )}

      {!isLive && (
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 600,
          opacity: 0.7,
          marginBottom: '0.35rem',
        }}>
          Coming Up
        </div>
      )}

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.2rem',
        fontWeight: 500,
        marginBottom: '0.35rem',
      }}>
        {activeEvent.title}
      </div>

      <div style={{
        fontSize: '0.8rem',
        opacity: 0.8,
        marginBottom: isLive ? 0 : '0.5rem',
      }}>
        {activeEvent.location}
      </div>

      {!isLive && countdown && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-gold-light)',
          letterSpacing: '0.05em',
        }}>
          {countdown}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
