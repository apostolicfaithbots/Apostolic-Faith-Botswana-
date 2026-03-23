import { useScrollReveal } from '../hooks/useGsap'

const basePath = import.meta.env.BASE_URL

export default function AboutPage() {
  const revealRef = useScrollReveal()

  return (
    <div ref={revealRef}>
      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '10rem 0 5rem',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${basePath}images/church-front.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'brightness(0.2)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,26,0.5) 0%, rgba(26,26,26,0.9) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
          <div className="reveal" style={{
            fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1rem',
          }}>About Us</div>
          <h1 className="reveal" data-delay="0.1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400, marginBottom: '1.25rem', lineHeight: 1.1,
          }}>
            Our Faith, Our Story
          </h1>
          <p className="reveal" data-delay="0.2" style={{
            fontSize: '1.05rem', opacity: 0.75, maxWidth: '600px', lineHeight: 1.8,
          }}>
            Rooted in the original Pentecostal message, serving the people of Botswana and beyond with the unchanging Gospel of Jesus Christ.
          </p>
        </div>
      </section>

      {/* Our Beliefs */}
      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 5vw, 5rem)', alignItems: 'start',
          }} className="two-col">
            <div>
              <div className="reveal" style={{
                fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'var(--color-red)', fontWeight: 600, marginBottom: '1rem',
              }}>Our Beliefs</div>
              <h2 className="reveal" data-delay="0.1" style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--color-black)',
                marginBottom: '1.5rem', lineHeight: 1.1,
              }}>
                Founded on <span style={{ color: 'var(--color-red)' }}>Scripture</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { title: 'Salvation', text: 'We believe in a born-again experience through repentance and faith in Jesus Christ, resulting in a transformed life.' },
                  { title: 'Sanctification', text: 'A second, definite work of grace whereby the heart is cleansed and set apart for holy living through the blood of Jesus Christ.' },
                  { title: 'Baptism of the Holy Spirit', text: 'We believe in the baptism of the Holy Ghost and fire with the evidence of speaking in other tongues as the Spirit gives utterance.' },
                  { title: 'The Bible', text: 'We hold the Bible as the inspired Word of God, the foundation and final authority for all matters of faith and practice.' },
                ].map((item, i) => (
                  <div key={i} className="reveal" data-delay={0.15 + i * 0.08}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                      color: 'var(--color-black)', marginBottom: '0.3rem',
                    }}>{item.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-gray-600)', lineHeight: 1.7 }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal" data-delay="0.2" style={{ position: 'relative' }}>
              <img
                src={`${basePath}images/church-front-2.jpg`}
                alt="Apostolic Faith Tabernacle front view"
                style={{ width: '100%', height: '550px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <div style={{
                position: 'absolute', bottom: '-1rem', left: '-1rem',
                width: '200px', height: '200px',
                background: 'var(--color-red)', opacity: 0.08, borderRadius: '4px', zIndex: -1,
              }} />
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) { .two-col { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* History */}
      <section className="section" style={{ background: 'var(--color-white)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal" style={{
            fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--color-red)', fontWeight: 600, marginBottom: '1rem', textAlign: 'center',
          }}>Our Heritage</div>
          <h2 className="reveal" data-delay="0.1" style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--color-black)',
            marginBottom: '2rem', textAlign: 'center', lineHeight: 1.1,
          }}>
            The Apostolic Faith Mission
          </h2>
          <div className="reveal" data-delay="0.2" style={{
            fontSize: '1rem', color: 'var(--color-gray-600)', lineHeight: 1.9,
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            <p>
              The Apostolic Faith Church traces its roots to the great Azusa Street Revival of 1906 in Los Angeles, California. Florence Crawford, one of the workers at the Azusa Mission, was led by God to establish the Apostolic Faith Mission in Portland, Oregon in 1908, where the world headquarters remains today.
            </p>
            <p>
              From Portland, the Gospel message has spread to approximately fifty countries around the world. The Apostolic Faith Church in Botswana is part of this worldwide fellowship, bringing the same Pentecostal message of salvation, sanctification, and the baptism of the Holy Spirit to the people of southern Africa.
            </p>
            <p>
              Our church in Gaborone stands as a testimony to God's faithfulness. The Apostolic Faith Tabernacle at Plot 54021, Phase 4, serves as a centre for worship, fellowship, and outreach across Botswana and the surrounding region. Through revivals, camps, and faithful preaching of the Word, we continue the work that began over a century ago.
            </p>
          </div>
        </div>
      </section>

      {/* Values Strip */}
      <section style={{
        background: 'var(--color-gray-900)', color: '#fff',
        padding: 'clamp(3rem, 6vw, 5rem) 0',
      }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem', textAlign: 'center',
          }}>
            {[
              { num: '50+', label: 'Countries Worldwide' },
              { num: '100+', label: 'Years of Ministry' },
              { num: '37', label: 'Events in 2026' },
              { num: '1906', label: 'Year Founded' },
            ].map((item, i) => (
              <div key={i} className="reveal" data-delay={i * 0.1}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 300, color: 'var(--color-gold)', lineHeight: 1, marginBottom: '0.5rem',
                }}>{item.num}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.6, letterSpacing: '0.05em' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Church Gallery */}
      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="reveal" style={{
              fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--color-red)', fontWeight: 600, marginBottom: '0.75rem',
            }}>Our Church</div>
            <h2 className="reveal" data-delay="0.1" style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--color-black)',
            }}>The Tabernacle</h2>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', height: '500px',
          }} className="gallery-grid">
            <div className="reveal" style={{ borderRadius: '4px', overflow: 'hidden' }}>
              <img src={`${basePath}images/church-side.jpg`} alt="Church side view"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="reveal" data-delay="0.1" style={{ flex: 1, borderRadius: '4px', overflow: 'hidden' }}>
                <img src={`${basePath}images/church-front.jpg`} alt="Church front view"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="reveal" data-delay="0.2" style={{ flex: 1, borderRadius: '4px', overflow: 'hidden' }}>
                <img src={`${basePath}images/church-front-2.jpg`} alt="Church entrance"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .gallery-grid { grid-template-columns: 1fr !important; height: auto !important; }
            .gallery-grid img { height: 250px !important; }
          }
        `}</style>
      </section>
    </div>
  )
}
