import { useState, useMemo } from 'react'
import { useScrollReveal } from '../hooks/useGsap'
import { format, parseISO } from 'date-fns'

const categories = [
  { key: 'all', label: 'All Lessons' },
  { key: 'primary_pals', label: 'Primary Pals' },
  { key: 'search', label: 'Search (Students)' },
  { key: 'adults', label: 'Adults' },
  { key: 'youth', label: 'Youth' },
  { key: 'general', label: 'General' },
]

const catColors = { primary_pals: '#E8884F', search: '#3A6B9F', adults: '#4A7C59', youth: '#6B4FA0', general: '#636568' }

export default function LessonsPage({ lessons }) {
  const revealRef = useScrollReveal()
  const [cat, setCat] = useState('all')

  const filtered = useMemo(() => {
    return cat === 'all' ? lessons : lessons.filter(l => l.category === cat)
  }, [lessons, cat])

  return (
    <div ref={revealRef}>
      <section style={{ background: 'var(--color-gray-900)', color: '#fff', padding: '8rem 0 4rem' }}>
        <div className="container">
          <div className="reveal" style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1rem' }}>Curriculum</div>
          <h1 className="reveal" data-delay="0.1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 400, marginBottom: '1rem' }}>Weekly Lessons</h1>
          <p className="reveal" data-delay="0.2" style={{ fontSize: '1.05rem', opacity: 0.7, maxWidth: '600px' }}>
            Bible lessons for students of all ages. From Primary Pals for children to in-depth adult studies, find your lesson for this week.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-200)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)} style={{
              padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 500,
              borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s',
              background: cat === c.key ? 'var(--color-gray-900)' : 'transparent',
              color: cat === c.key ? '#fff' : 'var(--color-gray-600)',
              border: `1px solid ${cat === c.key ? 'var(--color-gray-900)' : 'var(--color-gray-300)'}`,
            }}>{c.label}</button>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          {filtered.length === 0 ? (
            <div className="reveal" style={{
              background: '#fff', padding: 'clamp(3rem,6vw,5rem)', borderRadius: '4px',
              border: '1px solid var(--color-gray-200)', textAlign: 'center', maxWidth: '600px', margin: '0 auto',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.15 }}>&#128214;</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-black)', marginBottom: '0.75rem' }}>
                {cat === 'all' ? 'Lessons Coming Soon' : `${categories.find(c => c.key === cat)?.label} Coming Soon`}
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-500)', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
                Weekly Sunday School lessons will be published here by the church admin. Check back soon for new materials.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filtered.map((l, i) => {
                const color = catColors[l.category] || '#636568'
                return (
                  <div key={l.id} className="reveal" data-delay={Math.min(i * 0.06, 0.3)} style={{
                    background: '#fff', padding: '1.5rem', borderRadius: '4px',
                    border: '1px solid var(--color-gray-200)', borderTop: `3px solid ${color}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem', background: color, color: '#fff',
                        fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '2px',
                      }}>{l.category.replace('_', ' ')}</span>
                      {l.week_date && <span style={{ fontSize: '0.72rem', color: 'var(--color-gray-400)' }}>{format(parseISO(l.week_date), 'dd MMM yyyy')}</span>}
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-black)', marginBottom: '0.35rem', lineHeight: 1.25 }}>{l.title}</h3>
                    {l.scripture_ref && <div style={{ fontSize: '0.82rem', color: 'var(--color-gold-dark)', fontStyle: 'italic', marginBottom: '0.5rem' }}>{l.scripture_ref}</div>}
                    {l.description && <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{l.description}</p>}

                    {l.pdf_url && (
                      <a href={l.pdf_url} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-block', marginTop: '0.75rem', fontSize: '0.72rem',
                        color: 'var(--color-red)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                      }}>Download PDF &rarr;</a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
