import { useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useScrollReveal } from '../hooks/useGsap'
import { format, isAfter, parseISO } from 'date-fns'

const basePath = import.meta.env.BASE_URL

export default function HomePage({ events, announcements, sermons, loading }) {
  const heroRef = useRef(null)
  const revealRef = useScrollReveal()

  useEffect(() => {
    if (!heroRef.current) return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    
    tl.fromTo('.hero-overlay', { opacity: 0 }, { opacity: 1, duration: 1.2 })
      .fromTo('.hero-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
      .fromTo('.hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 0.5)
      .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.8)
      .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 1.1)
      .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.5)
  }, [])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return events
      .filter(e => {
        const end = new Date(e.end_date + 'T23:59:59')
        return end >= now
      })
      .slice(0, 4)
  }, [events])

  return (
    <div ref={revealRef}>
      {/* HERO SECTION */}
      <section ref={heroRef} style={{
        position: 'relative',
        height: '100vh',
        minHeight: '650px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#111',
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${basePath}images/church-side.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35)',
          transform: 'scale(1.05)',
        }} />
        
        {/* Gradient overlay */}
        <div className="hero-overlay" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.6) 100%)',
        }} />

        {/* Grain texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: '#fff',
          maxWidth: '800px',
          padding: '0 2rem',
        }}>
          <div className="hero-tag" style={{
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-light)',
            fontWeight: 500,
            marginBottom: '1.5rem',
            opacity: 0,
          }}>
            Apostolic Faith Tabernacle &mdash; Gaborone, Botswana
          </div>

          <h1 className="hero-title" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            opacity: 0,
          }}>
            Jesus,<br />
            <span style={{ color: 'var(--color-gold)' }}>The Light</span> of The World
          </h1>

          <p className="hero-subtitle" style={{
            fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
            lineHeight: 1.7,
            maxWidth: '550px',
            margin: '0 auto 2.5rem',
            opacity: 0,
            color: 'rgba(255,255,255,0.8)',
          }}>
            A Bible-believing church committed to upholding the Gospel of Jesus Christ. Join us in worship, fellowship, and the study of God&apos;s Word.
          </p>

          <div className="hero-cta" style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: 0,
          }}>
            <Link to="/live" style={{
              padding: '0.85rem 2.5rem',
              background: 'var(--color-red)',
              color: '#fff',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              borderRadius: '2px',
              transition: 'all 0.3s',
            }}>
              Watch Live
            </Link>
            <Link to="/about" style={{
              padding: '0.85rem 2.5rem',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              borderRadius: '2px',
              transition: 'all 0.3s',
            }}>
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll" style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'rgba(255,255,255,0.4)',
        }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{
            width: '1px',
            height: '40px',
            background: 'rgba(255,255,255,0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: '-100%',
              width: '100%',
              height: '100%',
              background: 'var(--color-gold)',
              animation: 'scrollDown 2s ease-in-out infinite',
            }} />
          </div>
        </div>

        <style>{`
          @keyframes scrollDown {
            0% { top: -100%; }
            50% { top: 0; }
            100% { top: 100%; }
          }
        `}</style>
      </section>

      {/* SERVICE TIMES BAR */}
      <section style={{
        background: 'var(--color-gray-900)',
        color: '#fff',
        padding: '2rem 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '3rem',
        }}>
          <ServiceTime day="Sunday" time="09:00 AM" label="Sunday School" />
          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.12)' }} />
          <ServiceTime day="Sunday" time="10:30 AM" label="Devotional Service" />
          <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.12)', }} className="hide-mobile" />
          <div className="hide-mobile" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.25rem' }}>
              Location
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              Plot 54021, Phase 4, Gaborone
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 600px) {
            .hide-mobile { display: none !important; }
          }
        `}</style>
      </section>

      {/* WELCOME / ABOUT SNIPPET */}
      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }} className="two-col">
            <div>
              <div className="reveal" style={{
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-red)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}>
                Welcome
              </div>
              <h2 className="reveal" data-delay="0.1" style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--color-black)',
                marginBottom: '1.5rem',
                lineHeight: 1.1,
              }}>
                A Place of <span style={{ color: 'var(--color-red)' }}>Faith</span>,<br />
                Hope & Community
              </h2>
              <p className="reveal" data-delay="0.2" style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'var(--color-gray-600)',
                marginBottom: '1rem',
              }}>
                The Apostolic Faith Church in Botswana is part of the worldwide Apostolic Faith Mission headquartered in Portland, Oregon, USA. We are a traditional, Bible-believing church committed to the original Pentecostal doctrines of salvation, sanctification, and the baptism of the Holy Spirit.
              </p>
              <p className="reveal" data-delay="0.25" style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'var(--color-gray-600)',
                marginBottom: '2rem',
              }}>
                Our services are a time to worship God through music, be encouraged by testimonies of God working in lives today, and hear practical, relevant, Bible-based sermons.
              </p>
              <Link to="/about" className="reveal" data-delay="0.3" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--color-red)',
                borderBottom: '2px solid var(--color-red)',
                paddingBottom: '0.25rem',
              }}>
                About Our Church
                <span style={{ fontSize: '1.1rem' }}>&rarr;</span>
              </Link>
            </div>
            <div className="reveal" data-delay="0.2" style={{
              position: 'relative',
            }}>
              <img 
                src={`${basePath}images/church-front.jpg`}
                alt="Apostolic Faith Tabernacle - Gaborone"
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
              {/* Decorative accent */}
              <div style={{
                position: 'absolute',
                top: '-1rem',
                right: '-1rem',
                width: '120px',
                height: '120px',
                border: '2px solid var(--color-gold)',
                borderRadius: '4px',
                zIndex: -1,
              }} />
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .two-col { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="section" style={{ background: 'var(--color-white)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div className="reveal" style={{
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-red)',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}>
                Calendar
              </div>
              <h2 className="reveal" data-delay="0.1" style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                color: 'var(--color-black)',
              }}>
                Upcoming Events
              </h2>
            </div>
            <Link to="/events" className="reveal" data-delay="0.2" style={{
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--color-red)',
              borderBottom: '2px solid var(--color-red)',
              paddingBottom: '0.25rem',
            }}>
              View All Events &rarr;
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {upcomingEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CONNECT / CTA SECTION */}
      <section style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        overflow: 'hidden',
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${basePath}images/church-front-2.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.25)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(184,40,46,0.3) 0%, rgba(26,26,26,0.8) 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
          <div className="reveal" style={{
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-light)',
            fontWeight: 500,
            marginBottom: '1.25rem',
          }}>
            Join Us
          </div>
          <h2 className="reveal" data-delay="0.1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            marginBottom: '1.5rem',
            lineHeight: 1.1,
          }}>
            You Are Welcome Here
          </h2>
          <p className="reveal" data-delay="0.2" style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            opacity: 0.85,
          }}>
            Whether you are visiting for the first time or looking for a church home, we invite you to worship with us. Join us in person or online every Sunday.
          </p>
          <div className="reveal" data-delay="0.3" style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Link to="/contact" style={{
              padding: '0.85rem 2.5rem',
              background: 'var(--color-gold)',
              color: 'var(--color-black)',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              borderRadius: '2px',
            }}>
              Plan Your Visit
            </Link>
            <Link to="/live" style={{
              padding: '0.85rem 2.5rem',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              borderRadius: '2px',
            }}>
              Watch Online
            </Link>
          </div>
        </div>
      </section>

      {/* LINKS / RESOURCES */}
      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="reveal" style={{
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-red)',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}>
              Resources
            </div>
            <h2 className="reveal" data-delay="0.1" style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              color: 'var(--color-black)',
            }}>
              Quick Links
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { title: 'Zoom Meeting', desc: 'Join our services online via Zoom every Sunday.', href: 'https://us02web.zoom.us/j/84874457626?pwd=c2tYblRuWWEvYzZrYXFKYStyUTMvdz09', external: true },
              { title: 'YouTube Channel', desc: 'Watch recordings of our services and special events.', href: 'https://youtube.com/channel/UCi-ZVmGeaBSR4FkPDMuQ5IA', external: true },
              { title: 'World Headquarters', desc: 'Visit the Apostolic Faith Portland website.', href: 'https://www.apostolicfaith.org/', external: true },
              { title: 'Events Calendar', desc: 'View our full 2026 events calendar.', to: '/events' },
            ].map((item, i) => (
              <div key={i} className="reveal" data-delay={i * 0.1} style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '4px',
                border: '1px solid var(--color-gray-200)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
              }}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.3rem',
                      color: 'var(--color-black)',
                      marginBottom: '0.5rem',
                    }}>{item.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{item.desc}</p>
                    <span style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-red)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Visit &rarr;
                    </span>
                  </a>
                ) : (
                  <Link to={item.to} style={{ display: 'block' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.3rem',
                      color: 'var(--color-black)',
                      marginBottom: '0.5rem',
                    }}>{item.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{item.desc}</p>
                    <span style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-red)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Explore &rarr;
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function ServiceTime({ day, time, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '0.65rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        opacity: 0.5,
        marginBottom: '0.25rem',
      }}>
        {day}
      </div>
      <div style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        fontFamily: 'var(--font-display)',
        marginBottom: '0.15rem',
      }}>
        {time}
      </div>
      <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{label}</div>
    </div>
  )
}

function EventCard({ event, index }) {
  const now = new Date()
  const start = new Date(event.start_date + 'T00:00:00')
  const end = new Date(event.end_date + 'T23:59:59')
  const isLive = now >= start && now <= end
  const isPast = now > end

  const typeColors = {
    camp: 'var(--color-gold)',
    revival: 'var(--color-red)',
    service: '#4A7C59',
    celebration: '#6B4FA0',
    training: '#3A6B9F',
    meeting: 'var(--color-gray-600)',
  }

  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy')
    } catch {
      return dateStr
    }
  }

  return (
    <div className="reveal" data-delay={index * 0.1} style={{
      background: isPast ? 'var(--color-gray-100)' : '#fff',
      border: isLive ? '2px solid var(--color-red)' : '1px solid var(--color-gray-200)',
      borderRadius: '4px',
      padding: '1.75rem',
      position: 'relative',
      opacity: isPast ? 0.6 : 1,
      transition: 'all 0.4s ease',
    }}>
      {isLive && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--color-red)',
          color: '#fff',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#fff',
            animation: 'pulse 1.5s infinite',
          }} />
          Live
        </div>
      )}

      <div style={{
        display: 'inline-block',
        padding: '0.2rem 0.6rem',
        background: typeColors[event.type] || 'var(--color-gray-500)',
        color: '#fff',
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontWeight: 600,
        borderRadius: '2px',
        marginBottom: '1rem',
      }}>
        {event.type || 'Event'}
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.35rem',
        color: 'var(--color-black)',
        marginBottom: '0.75rem',
        lineHeight: 1.2,
      }}>
        {event.title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--color-gray-600)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ opacity: 0.5 }}>&#x1f4c5;</span>
          {formatDate(event.start_date)}
          {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ opacity: 0.5 }}>&#x1f4cd;</span>
          {event.location}
        </div>
        {event.responsibility && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ opacity: 0.5 }}>&#x1f465;</span>
            {event.responsibility}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
