import { useScrollReveal } from '../hooks/useGsap'
import { format, parseISO } from 'date-fns'

export default function SermonsPage({ sermons }) {
  const revealRef = useScrollReveal()

  return (
    <div ref={revealRef}>
      <section style={{ background: 'var(--color-gray-900)', color: '#fff', padding: '8rem 0 4rem' }}>
        <div className="container">
          <div className="reveal" style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1rem' }}>Messages</div>
          <h1 className="reveal" data-delay="0.1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 400, marginBottom: '1rem' }}>Sermons</h1>
          <p className="reveal" data-delay="0.2" style={{ fontSize: '1.05rem', opacity: 0.7, maxWidth: '550px' }}>
            Listen to and watch recordings of our services, Bible studies, and special messages.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {sermons.length === 0 ? (
            <div className="reveal" style={{
              background: '#fff', padding: 'clamp(3rem,6vw,5rem)', borderRadius: '4px',
              border: '1px solid var(--color-gray-200)', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.15 }}>&#9835;</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-black)', marginBottom: '0.75rem' }}>Sermons Coming Soon</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-500)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>
                Sermon recordings will be made available here. In the meantime, join us live every Sunday or watch on our YouTube channel.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sermons.map((s, i) => (
                <div key={s.id} className="reveal" data-delay={Math.min(i * 0.06, 0.3)} style={{
                  background: '#fff', padding: '1.5rem', borderRadius: '4px',
                  border: '1px solid var(--color-gray-200)',
                  display: 'grid', gridTemplateColumns: s.youtube_url ? '1fr auto' : '1fr', gap: '1rem', alignItems: 'center',
                }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-black)', marginBottom: '0.3rem' }}>{s.title}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-gray-500)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {s.speaker && <span>{s.speaker}</span>}
                      {s.date && <span>{format(parseISO(s.date), 'dd MMM yyyy')}</span>}
                      {s.scripture_ref && <span style={{ fontStyle: 'italic' }}>{s.scripture_ref}</span>}
                    </div>
                    {s.description && <p style={{ fontSize: '0.88rem', color: 'var(--color-gray-600)', marginTop: '0.5rem', lineHeight: 1.6 }}>{s.description}</p>}
                  </div>
                  {s.youtube_url && (
                    <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" style={{
                      padding: '0.5rem 1rem', background: 'var(--color-red)', color: '#fff',
                      fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                      fontWeight: 600, borderRadius: '2px', whiteSpace: 'nowrap',
                    }}>Watch</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
