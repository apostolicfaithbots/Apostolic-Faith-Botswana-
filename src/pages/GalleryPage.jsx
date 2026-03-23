import { useState, useMemo } from 'react'
import { useScrollReveal } from '../hooks/useGsap'

export default function GalleryPage({ gallery }) {
  const revealRef = useScrollReveal()
  const [activeAlbum, setActiveAlbum] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  const albums = useMemo(() => {
    const set = new Set(gallery.map(g => g.album || 'General'))
    return ['all', ...Array.from(set)]
  }, [gallery])

  const filtered = useMemo(() => {
    return activeAlbum === 'all' ? gallery : gallery.filter(g => (g.album || 'General') === activeAlbum)
  }, [gallery, activeAlbum])

  return (
    <div ref={revealRef}>
      <section style={{ background: 'var(--color-gray-900)', color: '#fff', padding: '8rem 0 4rem' }}>
        <div className="container">
          <div className="reveal" style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1rem' }}>Photos</div>
          <h1 className="reveal" data-delay="0.1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 400, marginBottom: '1rem' }}>Gallery</h1>
          <p className="reveal" data-delay="0.2" style={{ fontSize: '1.05rem', opacity: 0.7, maxWidth: '550px' }}>
            Photos from our services, camps, revivals, and community events.
          </p>
        </div>
      </section>

      {/* Album filter */}
      {gallery.length > 0 && (
        <section style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-200)', padding: '1rem 0' }}>
          <div className="container" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {albums.map(a => (
              <button key={a} onClick={() => setActiveAlbum(a)} style={{
                padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 500, textTransform: 'capitalize',
                borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s',
                background: activeAlbum === a ? 'var(--color-gray-900)' : 'transparent',
                color: activeAlbum === a ? '#fff' : 'var(--color-gray-600)',
                border: `1px solid ${activeAlbum === a ? 'var(--color-gray-900)' : 'var(--color-gray-300)'}`,
              }}>{a === 'all' ? 'All Photos' : a}</button>
            ))}
          </div>
        </section>
      )}

      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          {filtered.length === 0 ? (
            <div className="reveal" style={{
              background: '#fff', padding: 'clamp(3rem,6vw,5rem)', borderRadius: '4px',
              border: '1px solid var(--color-gray-200)', textAlign: 'center', maxWidth: '600px', margin: '0 auto',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.15 }}>&#128247;</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-black)', marginBottom: '0.75rem' }}>Gallery Coming Soon</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-500)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>
                Photos from our services and events will be uploaded here by the church admin. Stay tuned.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '0.75rem',
            }}>
              {filtered.map((photo, i) => (
                <div key={photo.id} className="reveal" data-delay={Math.min(i * 0.04, 0.3)}
                  onClick={() => setLightbox(photo)}
                  style={{
                    borderRadius: '4px', overflow: 'hidden', cursor: 'pointer',
                    aspectRatio: '4/3', position: 'relative',
                    background: 'var(--color-gray-200)',
                  }}>
                  <img src={photo.image_url} alt={photo.title || 'Gallery photo'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  />
                  {photo.title && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      padding: '2rem 1rem 0.75rem', color: '#fff',
                    }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{photo.title}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', cursor: 'pointer',
        }}>
          <button onClick={() => setLightbox(null)} style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            color: '#fff', fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer',
          }}>&times;</button>
          <img src={lightbox.image_url} alt={lightbox.title || ''}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '4px' }}
            onClick={e => e.stopPropagation()}
          />
          {lightbox.title && (
            <div style={{ position: 'absolute', bottom: '2rem', color: '#fff', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{lightbox.title}</div>
              {lightbox.description && <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem' }}>{lightbox.description}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
