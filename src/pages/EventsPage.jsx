import { useState, useMemo } from 'react'
import { useScrollReveal } from '../hooks/useGsap'
import { format, parseISO } from 'date-fns'

export default function EventsPage({ events }) {
  const revealRef = useScrollReveal()
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeMonth, setActiveMonth] = useState('all')

  const months = [
    'all', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const types = ['all', 'camp', 'revival', 'service', 'celebration', 'training', 'meeting']

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchType = activeFilter === 'all' || event.type === activeFilter
      const eventMonth = new Date(event.start_date + 'T00:00:00').getMonth()
      const matchMonth = activeMonth === 'all' || months.indexOf(activeMonth) - 1 === eventMonth
      return matchType && matchMonth
    })
  }, [events, activeFilter, activeMonth])

  const typeColors = {
    camp: 'var(--color-gold)',
    revival: 'var(--color-red)',
    service: '#4A7C59',
    celebration: '#6B4FA0',
    training: '#3A6B9F',
    meeting: 'var(--color-gray-600)',
  }

  const formatDate = (dateStr) => {
    try { return format(parseISO(dateStr), 'dd MMM yyyy') }
    catch { return dateStr }
  }

  return (
    <div ref={revealRef}>
      {/* Page Header */}
      <section style={{
        background: 'var(--color-gray-900)',
        color: '#fff',
        padding: '8rem 0 4rem',
      }}>
        <div className="container">
          <div className="reveal" style={{
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            2026 Calendar
          </div>
          <h1 className="reveal" data-delay="0.1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400,
            marginBottom: '1rem',
          }}>
            Events & Activities
          </h1>
          <p className="reveal" data-delay="0.2" style={{
            fontSize: '1.05rem',
            opacity: 0.7,
            maxWidth: '600px',
          }}>
            Stay up to date with our revivals, camps, celebrations, and services throughout the year.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-200)', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-gray-500)', display: 'block', marginBottom: '0.4rem' }}>
                Month
              </label>
              <select
                value={activeMonth}
                onChange={(e) => setActiveMonth(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-gray-200)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  background: '#fff',
                  color: 'var(--color-charcoal)',
                  cursor: 'pointer',
                }}
              >
                {months.map(m => (
                  <option key={m} value={m}>{m === 'all' ? 'All Months' : m}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  style={{
                    padding: '0.4rem 1rem',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    textTransform: 'capitalize',
                    fontWeight: 500,
                    borderRadius: '20px',
                    background: activeFilter === type ? 'var(--color-gray-900)' : 'transparent',
                    color: activeFilter === type ? '#fff' : 'var(--color-gray-600)',
                    border: `1px solid ${activeFilter === type ? 'var(--color-gray-900)' : 'var(--color-gray-300)'}`,
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-500)' }}>
              <p style={{ fontSize: '1.1rem' }}>No events found for the selected filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredEvents.map((event, i) => {
                const now = new Date()
                const start = new Date(event.start_date + 'T00:00:00')
                const end = new Date(event.end_date + 'T23:59:59')
                const isLive = now >= start && now <= end
                const isPast = now > end

                return (
                  <div key={event.id} className="reveal event-row" data-delay={Math.min(i * 0.05, 0.3)} style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                    background: isLive ? 'rgba(184,40,46,0.04)' : '#fff',
                    border: isLive ? '1px solid var(--color-red)' : '1px solid var(--color-gray-200)',
                    borderRadius: '4px',
                    padding: '1.5rem',
                    opacity: isPast ? 0.5 : 1,
                    transition: 'all 0.3s',
                  }}>
                    {/* Date block */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        fontWeight: 600,
                        color: 'var(--color-black)',
                        lineHeight: 1,
                      }}>
                        {format(parseISO(event.start_date), 'dd')}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--color-gray-500)',
                      }}>
                        {format(parseISO(event.start_date), 'MMM')}
                      </div>
                    </div>

                    {/* Event details */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <h3 style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          color: 'var(--color-black)',
                        }}>
                          {event.title}
                        </h3>
                        <span style={{
                          padding: '0.15rem 0.5rem',
                          background: typeColors[event.type] || 'var(--color-gray-500)',
                          color: '#fff',
                          fontSize: '0.55rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          borderRadius: '2px',
                        }}>
                          {event.type}
                        </span>
                        {isLive && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.15rem 0.5rem',
                            background: 'var(--color-red)',
                            color: '#fff',
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            borderRadius: '2px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                          }}>
                            <span style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: '#fff',
                              animation: 'pulse 1.5s infinite',
                            }} />
                            Live
                          </span>
                        )}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-gray-600)',
                        flexWrap: 'wrap',
                      }}>
                        <span>{formatDate(event.start_date)}{event.start_date !== event.end_date ? ` - ${formatDate(event.end_date)}` : ''}</span>
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Responsibility */}
                    <div className="hide-sm" style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-gray-500)',
                      textAlign: 'right',
                    }}>
                      {event.responsibility}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 768px) {
          .event-row {
            grid-template-columns: 80px 1fr !important;
          }
          .hide-sm { display: none !important; }
        }
      `}</style>
    </div>
  )
}
