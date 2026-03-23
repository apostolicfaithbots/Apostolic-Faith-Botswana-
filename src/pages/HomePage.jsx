import { useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useScrollReveal } from '../hooks/useGsap'
import { format, parseISO } from 'date-fns'
import LiveCountdown, { useNow, getCountdown } from '../components/LiveCountdown'

const basePath = import.meta.env.BASE_URL
const typeColors = { camp:'#C9A84C', revival:'#B8282E', service:'#4A7C59', celebration:'#6B4FA0', training:'#3A6B9F', meeting:'#636568' }

export default function HomePage({ events, announcements, sermons, lessons, loading }) {
  const heroRef = useRef(null)
  const revealRef = useScrollReveal()
  const now = useNow(1000)

  useEffect(() => {
    if (!heroRef.current) return
    const tl = gsap.timeline({ defaults: { ease:'power3.out' } })
    tl.fromTo('.hero-tag',{opacity:0,y:20},{opacity:1,y:0,duration:0.8},0.3)
      .fromTo('.hero-title',{opacity:0,y:50},{opacity:1,y:0,duration:1},0.5)
      .fromTo('.hero-subtitle',{opacity:0,y:30},{opacity:1,y:0,duration:0.8},0.8)
      .fromTo('.hero-cta',{opacity:0,y:20},{opacity:1,y:0,duration:0.7},1.1)
      .fromTo('.hero-scroll',{opacity:0},{opacity:1,duration:0.6},1.5)
  }, [])

  const campNotice = useMemo(() => {
    const camps = events.filter(e => e.type === 'camp')
    for (const c of camps) {
      const start = new Date(c.start_date+'T00:00:00'), end = new Date(c.end_date+'T23:59:59')
      if (now >= start && now <= end) {
        const pct = Math.min(((now-start)/(end-start))*100,100)
        let status = 'Happening Now'
        if (pct >= 85) status = 'Almost Done'
        return { ...c, status, pct, isLive:true }
      }
    }
    const upcoming = camps.filter(c => new Date(c.start_date+'T00:00:00') > now)
    if (upcoming.length) return { ...upcoming[0], status:'Upcoming', pct:0, isLive:false }
    return null
  }, [events, now])

  const upcomingEvents = useMemo(() => events.filter(e => new Date(e.end_date+'T23:59:59') >= now).slice(0,6), [events, now])

  return (
    <div ref={revealRef}>
      {/* HERO */}
      <section ref={heroRef} style={{ position:'relative', height:'100vh', minHeight:'650px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#111' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(${basePath}images/church-side.jpg)`, backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.3)', transform:'scale(1.05)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%)' }} />
        <div style={{ position:'absolute', inset:0, opacity:0.03, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div style={{ position:'relative', zIndex:2, textAlign:'center', color:'#fff', maxWidth:'800px', padding:'0 2rem' }}>
          <div className="hero-tag" style={{ fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--color-gold-light)', fontWeight:500, marginBottom:'1.5rem', opacity:0 }}>Apostolic Faith Tabernacle &mdash; Gaborone, Botswana</div>
          <h1 className="hero-title" style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,7vw,5rem)', fontWeight:400, lineHeight:1.05, marginBottom:'1.5rem', opacity:0 }}>Jesus,<br /><span style={{ color:'var(--color-gold)' }}>The Light</span> of The World</h1>
          <p className="hero-subtitle" style={{ fontSize:'clamp(0.95rem,1.5vw,1.15rem)', lineHeight:1.7, maxWidth:'550px', margin:'0 auto 2.5rem', opacity:0, color:'rgba(255,255,255,0.8)' }}>A Bible-believing church committed to upholding the Gospel of Jesus Christ. Join us in worship, fellowship, and the study of God&apos;s Word.</p>
          <div className="hero-cta" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', opacity:0 }}>
            <Link to="/live" style={{ padding:'0.85rem 2.5rem', background:'var(--color-red)', color:'#fff', fontSize:'0.8rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, borderRadius:'2px' }}>Watch Live</Link>
            <Link to="/about" style={{ padding:'0.85rem 2.5rem', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', fontSize:'0.8rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, borderRadius:'2px' }}>Learn More</Link>
          </div>
        </div>
        <div className="hero-scroll" style={{ position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)', opacity:0, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', color:'rgba(255,255,255,0.4)' }}>
          <span style={{ fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase' }}>Scroll</span>
          <div style={{ width:'1px', height:'40px', background:'rgba(255,255,255,0.3)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-100%', width:'100%', height:'100%', background:'var(--color-gold)', animation:'scrollDown 2s ease-in-out infinite' }} />
          </div>
        </div>
        <style>{`@keyframes scrollDown{0%{top:-100%}50%{top:0}100%{top:100%}}`}</style>
      </section>

      {/* CAMP MEETING BANNER */}
      {campNotice && (
        <section style={{ background: campNotice.isLive ? 'var(--color-red)' : 'var(--color-gray-900)', color:'#fff', padding:'1.25rem 0' }}>
          <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              {campNotice.isLive && <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#fff', animation:'cmpPulse 1.5s infinite', flexShrink:0 }} />}
              <span style={{ fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:700, opacity:0.9 }}>{campNotice.status}</span>
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:500 }}>
              {campNotice.title} &mdash; {campNotice.location}
            </div>
            {campNotice.isLive ? (
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <div style={{ width:'120px', height:'4px', background:'rgba(255,255,255,0.2)', borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ width:`${campNotice.pct}%`, height:'100%', background:'var(--color-gold)', borderRadius:'2px', transition:'width 1s' }} />
                </div>
                <span style={{ fontSize:'0.75rem', fontWeight:600, opacity:0.8 }}>{Math.round(campNotice.pct)}%</span>
              </div>
            ) : (
              <LiveCountdown targetDate={new Date(campNotice.start_date+'T00:00:00')} now={now} size="sm" light />
            )}
          </div>
          <style>{`@keyframes cmpPulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
        </section>
      )}

      {/* SERVICE TIMES */}
      <section style={{ background: campNotice ? 'var(--color-charcoal)' : 'var(--color-gray-900)', color:'#fff', padding:'1.75rem 0' }}>
        <div className="container" style={{ display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', gap:'2.5rem' }}>
          <SvcTime day="Sunday" time="09:00 AM" label="Sunday School" />
          <div style={{ width:'1px', height:'36px', background:'rgba(255,255,255,0.1)' }} />
          <SvcTime day="Sunday" time="10:30 AM" label="Devotional Service" />
          <div style={{ width:'1px', height:'36px', background:'rgba(255,255,255,0.1)' }} className="hide-sm" />
          <div className="hide-sm" style={{ textAlign:'center' }}>
            <div style={{ fontSize:'0.6rem', letterSpacing:'0.15em', textTransform:'uppercase', opacity:0.5, marginBottom:'0.2rem' }}>Location</div>
            <div style={{ fontSize:'0.88rem', fontWeight:500 }}>Plot 54021, Phase 4, Gaborone</div>
          </div>
        </div>
        <style>{`@media(max-width:600px){.hide-sm{display:none!important}}`}</style>
      </section>

      {/* WELCOME */}
      <section className="section" style={{ background:'var(--color-cream)' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(2rem,5vw,5rem)', alignItems:'center' }} className="two-col">
            <div>
              <div className="reveal" style={{ fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-red)', fontWeight:600, marginBottom:'1rem' }}>Welcome</div>
              <h2 className="reveal" data-delay="0.1" style={{ fontSize:'clamp(2rem,4vw,3rem)', color:'var(--color-black)', marginBottom:'1.5rem', lineHeight:1.1 }}>A Place of <span style={{ color:'var(--color-red)' }}>Faith</span>,<br />Hope & Community</h2>
              <p className="reveal" data-delay="0.2" style={{ fontSize:'1rem', lineHeight:1.8, color:'var(--color-gray-600)', marginBottom:'1rem' }}>The Apostolic Faith Church in Botswana is part of the worldwide Apostolic Faith Mission headquartered in Portland, Oregon, USA. We are committed to the original Pentecostal doctrines of salvation, sanctification, and the baptism of the Holy Spirit.</p>
              <p className="reveal" data-delay="0.25" style={{ fontSize:'1rem', lineHeight:1.8, color:'var(--color-gray-600)', marginBottom:'2rem' }}>Our services are a time to worship God through music, be encouraged by testimonies, and hear practical, Bible-based sermons.</p>
              <Link to="/about" className="reveal" data-delay="0.3" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', fontSize:'0.8rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, color:'var(--color-red)', borderBottom:'2px solid var(--color-red)', paddingBottom:'0.25rem' }}>About Our Church <span>&rarr;</span></Link>
            </div>
            <div className="reveal" data-delay="0.2" style={{ position:'relative' }}>
              <img src={`${basePath}images/church-front.jpg`} alt="Apostolic Faith Tabernacle" style={{ width:'100%', height:'500px', objectFit:'cover', borderRadius:'4px' }} />
              <div style={{ position:'absolute', top:'-1rem', right:'-1rem', width:'120px', height:'120px', border:'2px solid var(--color-gold)', borderRadius:'4px', zIndex:-1 }} />
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.two-col{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* UPCOMING EVENTS TIMELINE */}
      <section className="section" style={{ background:'var(--color-white)' }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <div className="reveal" style={{ fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-red)', fontWeight:600, marginBottom:'0.75rem' }}>Calendar</div>
              <h2 className="reveal" data-delay="0.1" style={{ fontSize:'clamp(2rem,4vw,2.8rem)', color:'var(--color-black)' }}>Upcoming Events</h2>
            </div>
            <Link to="/events" className="reveal" data-delay="0.2" style={{ fontSize:'0.8rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, color:'var(--color-red)', borderBottom:'2px solid var(--color-red)', paddingBottom:'0.25rem' }}>Full Calendar &rarr;</Link>
          </div>

          <div style={{ position:'relative', paddingLeft:'2rem' }}>
            <div style={{ position:'absolute', left:'7px', top:'8px', bottom:'8px', width:'2px', background:'var(--color-gray-200)' }} />
            <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
              {upcomingEvents.map((ev, i) => {
                const start = new Date(ev.start_date+'T00:00:00'), end = new Date(ev.end_date+'T23:59:59')
                const isLive = now >= start && now <= end
                const isUpcoming = now < start
                const color = typeColors[ev.type] || '#636568'
                return (
                  <div key={ev.id} className="reveal" data-delay={Math.min(i*0.08,0.4)} style={{ position:'relative', display:'flex', gap:'1.25rem', alignItems:'flex-start' }}>
                    <div style={{
                      position:'absolute', left:'-2rem', top:'6px',
                      width: isLive ? '16px':'12px', height: isLive ? '16px':'12px',
                      borderRadius:'50%', background: isLive ? 'var(--color-red)':'#fff',
                      border:`3px solid ${isLive ? 'var(--color-red)':color}`,
                      transform:'translateX(-50%)', marginLeft:'8px',
                      boxShadow: isLive ? '0 0 0 4px rgba(184,40,46,0.2)':'none',
                      animation: isLive ? 'dotPulse 2s infinite':'none',
                    }} />
                    <div style={{ minWidth:'70px', padding:'0.35rem 0.6rem', background:'var(--color-gray-100)', borderRadius:'4px', textAlign:'center', flexShrink:0 }}>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:600, color:'var(--color-black)', lineHeight:1 }}>{format(parseISO(ev.start_date),'dd')}</div>
                      <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--color-gray-500)' }}>{format(parseISO(ev.start_date),'MMM')}</div>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.25rem' }}>
                        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', color:'var(--color-black)' }}>{ev.title}</h3>
                        <span style={{ padding:'0.1rem 0.45rem', background:color, color:'#fff', fontSize:'0.55rem', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600, borderRadius:'2px' }}>{ev.type}</span>
                        {isLive && <span style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem', padding:'0.1rem 0.45rem', background:'var(--color-red)', color:'#fff', fontSize:'0.55rem', fontWeight:700, borderRadius:'2px', letterSpacing:'0.08em', textTransform:'uppercase' }}><span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#fff', animation:'dotPulse 1.5s infinite' }} />Live</span>}
                      </div>
                      <div style={{ fontSize:'0.82rem', color:'var(--color-gray-500)', marginBottom: isUpcoming ? '0.5rem':'0' }}>
                        {format(parseISO(ev.start_date),'dd MMM')}{ev.start_date !== ev.end_date ? ` - ${format(parseISO(ev.end_date),'dd MMM')}`:''} &middot; {ev.location}
                      </div>
                      {isUpcoming && <LiveCountdown targetDate={start} now={now} size="sm" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <style>{`@keyframes dotPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        </div>
      </section>

      {/* LESSONS & SERMONS */}
      <section className="section" style={{ background:'var(--color-cream)' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(2rem,4vw,4rem)' }} className="two-col">
            <div>
              <div className="reveal" style={{ fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-red)', fontWeight:600, marginBottom:'0.75rem' }}>Weekly Lessons</div>
              <h2 className="reveal" data-delay="0.1" style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'var(--color-black)', marginBottom:'1.5rem' }}>Sunday School Resources</h2>
              {lessons.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  {lessons.slice(0,3).map((l,i) => (
                    <div key={l.id} className="reveal" data-delay={0.15+i*0.08} style={{ background:'#fff', padding:'1.25rem', borderRadius:'4px', border:'1px solid var(--color-gray-200)' }}>
                      <span style={{ padding:'0.1rem 0.4rem', background:'var(--color-gray-100)', fontSize:'0.6rem', fontWeight:600, textTransform:'uppercase', borderRadius:'2px', color:'var(--color-gray-600)', letterSpacing:'0.06em' }}>{l.category.replace('_',' ')}</span>
                      <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--color-black)', marginTop:'0.4rem', marginBottom:'0.2rem' }}>{l.title}</h3>
                      {l.scripture_ref && <div style={{ fontSize:'0.8rem', color:'var(--color-gray-500)', fontStyle:'italic' }}>{l.scripture_ref}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="reveal" data-delay="0.15" style={{ background:'#fff', padding:'2.5rem', borderRadius:'4px', border:'1px solid var(--color-gray-200)', textAlign:'center', color:'var(--color-gray-400)' }}>
                  <div style={{ fontSize:'0.9rem', marginBottom:'0.5rem' }}>Lessons coming soon</div>
                  <div style={{ fontSize:'0.8rem' }}>Check back for weekly Sunday School materials</div>
                </div>
              )}
              <Link to="/lessons" className="reveal" data-delay="0.3" style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', marginTop:'1.25rem', fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:600, color:'var(--color-red)' }}>All Lessons &rarr;</Link>
            </div>
            <div>
              <div className="reveal" style={{ fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-red)', fontWeight:600, marginBottom:'0.75rem' }}>Sermons</div>
              <h2 className="reveal" data-delay="0.1" style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'var(--color-black)', marginBottom:'1.5rem' }}>Recent Messages</h2>
              {sermons.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  {sermons.slice(0,3).map((s,i) => (
                    <div key={s.id} className="reveal" data-delay={0.15+i*0.08} style={{ background:'#fff', padding:'1.25rem', borderRadius:'4px', border:'1px solid var(--color-gray-200)' }}>
                      <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--color-black)', marginBottom:'0.2rem' }}>{s.title}</h3>
                      <div style={{ fontSize:'0.8rem', color:'var(--color-gray-500)' }}>{s.speaker && <span>{s.speaker} &middot; </span>}{s.date && format(parseISO(s.date),'dd MMM yyyy')}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="reveal" data-delay="0.15" style={{ background:'#fff', padding:'2.5rem', borderRadius:'4px', border:'1px solid var(--color-gray-200)', textAlign:'center', color:'var(--color-gray-400)' }}>
                  <div style={{ fontSize:'0.9rem', marginBottom:'0.5rem' }}>Sermons coming soon</div>
                  <div style={{ fontSize:'0.8rem' }}>Recordings will be available here</div>
                </div>
              )}
              <Link to="/sermons" className="reveal" data-delay="0.3" style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', marginTop:'1.25rem', fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:600, color:'var(--color-red)' }}>All Sermons &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position:'relative', padding:'clamp(5rem,10vw,8rem) 0', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(${basePath}images/church-front-2.jpg)`, backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.25)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(184,40,46,0.3) 0%, rgba(26,26,26,0.8) 100%)' }} />
        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center', color:'#fff' }}>
          <div className="reveal" style={{ fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-gold-light)', fontWeight:500, marginBottom:'1.25rem' }}>Join Us</div>
          <h2 className="reveal" data-delay="0.1" style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:400, marginBottom:'1.5rem', lineHeight:1.1 }}>You Are Welcome Here</h2>
          <p className="reveal" data-delay="0.2" style={{ fontSize:'1.05rem', lineHeight:1.8, maxWidth:'600px', margin:'0 auto 2.5rem', opacity:0.85 }}>Whether visiting for the first time or looking for a church home, we invite you to worship with us in person or online every Sunday.</p>
          <div className="reveal" data-delay="0.3" style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/contact" style={{ padding:'0.85rem 2.5rem', background:'var(--color-gold)', color:'var(--color-black)', fontSize:'0.8rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, borderRadius:'2px' }}>Plan Your Visit</Link>
            <Link to="/live" style={{ padding:'0.85rem 2.5rem', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', fontSize:'0.8rem', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, borderRadius:'2px' }}>Watch Online</Link>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="section" style={{ background:'var(--color-cream)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <div className="reveal" style={{ fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--color-red)', fontWeight:600, marginBottom:'0.75rem' }}>Resources</div>
            <h2 className="reveal" data-delay="0.1" style={{ fontSize:'clamp(2rem,4vw,2.8rem)', color:'var(--color-black)' }}>Quick Links</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1.25rem' }}>
            {[
              { title:'Zoom Meeting', desc:'Join services online every Sunday.', href:'https://us02web.zoom.us/j/84874457626?pwd=c2tYblRuWWEvYzZrYXFKYStyUTMvdz09', ext:true },
              { title:'YouTube Channel', desc:'Watch service recordings.', href:'https://youtube.com/channel/UCi-ZVmGeaBSR4FkPDMuQ5IA', ext:true },
              { title:'World Headquarters', desc:'Visit the Portland website.', href:'https://www.apostolicfaith.org/', ext:true },
              { title:'Events Calendar', desc:'Full 2026 events calendar.', to:'/events' },
            ].map((item,i) => (
              <div key={i} className="reveal" data-delay={i*0.08} style={{ background:'#fff', padding:'1.5rem', borderRadius:'4px', border:'1px solid var(--color-gray-200)' }}>
                {item.ext ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ display:'block' }}>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--color-black)', marginBottom:'0.35rem' }}>{item.title}</h3>
                    <p style={{ fontSize:'0.85rem', color:'var(--color-gray-600)', lineHeight:1.6 }}>{item.desc}</p>
                    <span style={{ display:'inline-block', marginTop:'0.75rem', fontSize:'0.72rem', color:'var(--color-red)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>Visit &rarr;</span>
                  </a>
                ) : (
                  <Link to={item.to} style={{ display:'block' }}>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--color-black)', marginBottom:'0.35rem' }}>{item.title}</h3>
                    <p style={{ fontSize:'0.85rem', color:'var(--color-gray-600)', lineHeight:1.6 }}>{item.desc}</p>
                    <span style={{ display:'inline-block', marginTop:'0.75rem', fontSize:'0.72rem', color:'var(--color-red)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>Explore &rarr;</span>
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

function SvcTime({ day, time, label }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:'0.6rem', letterSpacing:'0.15em', textTransform:'uppercase', opacity:0.5, marginBottom:'0.2rem' }}>{day}</div>
      <div style={{ fontSize:'1rem', fontWeight:600, fontFamily:'var(--font-display)', marginBottom:'0.1rem' }}>{time}</div>
      <div style={{ fontSize:'0.78rem', opacity:0.7 }}>{label}</div>
    </div>
  )
}
