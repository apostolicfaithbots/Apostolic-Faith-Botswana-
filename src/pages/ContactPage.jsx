import { useState } from 'react'
import { useScrollReveal } from '../hooks/useGsap'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
  const revealRef = useScrollReveal()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const { error } = await supabase.from('contact_messages').insert([form])
      if (error) throw error
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setSending(false)
      setTimeout(() => setStatus(null), 5000)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1px solid var(--color-gray-200)',
    borderRadius: '4px',
    fontSize: '0.92rem',
    background: '#fff',
    color: 'var(--color-charcoal)',
    transition: 'border-color 0.3s',
    outline: 'none',
  }

  return (
    <div ref={revealRef}>
      {/* Header */}
      <section style={{
        background: 'var(--color-gray-900)', color: '#fff',
        padding: '8rem 0 4rem',
      }}>
        <div className="container">
          <div className="reveal" style={{
            fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1rem',
          }}>Get In Touch</div>
          <h1 className="reveal" data-delay="0.1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400, marginBottom: '1rem',
          }}>Contact Us</h1>
          <p className="reveal" data-delay="0.2" style={{
            fontSize: '1.05rem', opacity: 0.7, maxWidth: '550px',
          }}>
            We would love to hear from you. Reach out with any questions or prayer requests.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1.4fr',
            gap: 'clamp(2rem, 5vw, 4rem)',
          }} className="two-col">
            {/* Contact Info */}
            <div>
              <div className="reveal" style={{ marginBottom: '2.5rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                  color: 'var(--color-black)', marginBottom: '1.5rem',
                }}>Visit Us</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { label: 'Address', value: 'Plot 54021, Phase 4\nGaborone, Botswana' },
                    { label: 'Sunday School', value: '09:00 AM (CAT)' },
                    { label: 'Devotional Service', value: '10:30 AM (CAT)' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{
                        fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                        fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.25rem',
                      }}>{item.label}</div>
                      <div style={{
                        fontSize: '0.95rem', color: 'var(--color-charcoal)',
                        whiteSpace: 'pre-line', lineHeight: 1.6,
                      }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal" data-delay="0.1">
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                  color: 'var(--color-black)', marginBottom: '1rem',
                }}>Join Online</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a href="https://us02web.zoom.us/j/84874457626?pwd=c2tYblRuWWEvYzZrYXFKYStyUTMvdz09"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      fontSize: '0.9rem', color: 'var(--color-red)', fontWeight: 500,
                    }}>
                    Zoom &mdash; Meeting ID: 848 7445 7626
                  </a>
                  <a href="https://youtube.com/channel/UCi-ZVmGeaBSR4FkPDMuQ5IA"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      fontSize: '0.9rem', color: 'var(--color-red)', fontWeight: 500,
                    }}>
                    YouTube Channel
                  </a>
                  <a href="https://www.facebook.com/share/1YAWfu9SCg/"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      fontSize: '0.9rem', color: 'var(--color-red)', fontWeight: 500,
                    }}>
                    Facebook Page
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="reveal" data-delay="0.15">
              <div style={{
                background: '#fff', padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                borderRadius: '4px', border: '1px solid var(--color-gray-200)',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                  color: 'var(--color-black)', marginBottom: '1.5rem',
                }}>Send a Message</h3>

                <form onSubmit={handleSubmit} style={{
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Name</label>
                      <input
                        type="text" required value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        style={inputStyle} placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Email</label>
                      <input
                        type="email" required value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        style={inputStyle} placeholder="Your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Subject</label>
                    <input
                      type="text" required value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      style={inputStyle} placeholder="Subject"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-gray-600)', display: 'block', marginBottom: '0.35rem' }}>Message</label>
                    <textarea
                      required value={form.message} rows={5}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize: 'vertical' }} placeholder="Your message..."
                    />
                  </div>

                  <button type="submit" disabled={sending} style={{
                    padding: '0.85rem 2rem', background: 'var(--color-red)',
                    color: '#fff', fontSize: '0.8rem', letterSpacing: '0.12em',
                    textTransform: 'uppercase', fontWeight: 600, borderRadius: '2px',
                    transition: 'all 0.3s', opacity: sending ? 0.7 : 1, cursor: sending ? 'wait' : 'pointer',
                  }}>
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>

                  {status === 'success' && (
                    <div style={{ padding: '0.75rem 1rem', background: '#E8F5E9', color: '#2E7D32', borderRadius: '4px', fontSize: '0.85rem' }}>
                      Message sent successfully. We will get back to you soon.
                    </div>
                  )}
                  {status === 'error' && (
                    <div style={{ padding: '0.75rem 1rem', background: '#FFEBEE', color: '#C62828', borderRadius: '4px', fontSize: '0.85rem' }}>
                      Something went wrong. Please try again or contact us directly.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .two-col { grid-template-columns: 1fr !important; }
            .form-row { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </div>
  )
}
