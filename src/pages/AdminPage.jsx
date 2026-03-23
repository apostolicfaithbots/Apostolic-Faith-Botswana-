import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminPage({ onDataChange }) {
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('events')
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)

  // Check session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setAuthed(true)
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError(error.message)
    } else {
      setAuthed(true)
      loadData()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthed(false)
  }

  const loadData = async () => {
    setLoading(true)
    const [evRes, anRes] = await Promise.all([
      supabase.from('events').select('*').order('start_date', { ascending: true }),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
    ])
    if (evRes.data) setEvents(evRes.data)
    if (anRes.data) setAnnouncements(anRes.data)
    setLoading(false)
  }

  useEffect(() => {
    if (authed) loadData()
  }, [authed])

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-cream)', padding: '2rem',
      }}>
        <div style={{
          maxWidth: '400px', width: '100%', background: '#fff', padding: '2.5rem',
          borderRadius: '8px', border: '1px solid var(--color-gray-200)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.8rem',
              color: 'var(--color-black)', marginBottom: '0.5rem',
            }}>Admin Portal</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
              Sign in to manage church content
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} required
              style={inputStyle}
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required
              style={inputStyle}
            />
            {authError && (
              <div style={{ padding: '0.6rem', background: '#FFEBEE', color: '#C62828', borderRadius: '4px', fontSize: '0.8rem' }}>
                {authError}
              </div>
            )}
            <button type="submit" style={{
              padding: '0.85rem', background: 'var(--color-red)', color: '#fff',
              fontSize: '0.85rem', fontWeight: 600, borderRadius: '4px',
              letterSpacing: '0.05em', cursor: 'pointer',
            }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', paddingTop: '5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem clamp(1rem, 3vw, 2rem)' }}>
        {/* Admin Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-black)',
          }}>Content Manager</h1>
          <button onClick={handleLogout} style={{
            padding: '0.5rem 1.25rem', border: '1px solid var(--color-gray-300)',
            borderRadius: '4px', fontSize: '0.8rem', color: 'var(--color-gray-600)',
            cursor: 'pointer', background: '#fff',
          }}>
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '0', marginBottom: '2rem',
          borderBottom: '2px solid var(--color-gray-200)',
        }}>
          {['events', 'announcements'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: 600,
              textTransform: 'capitalize', cursor: 'pointer',
              color: activeTab === tab ? 'var(--color-red)' : 'var(--color-gray-500)',
              borderBottom: activeTab === tab ? '2px solid var(--color-red)' : '2px solid transparent',
              marginBottom: '-2px', background: 'none', transition: 'all 0.3s',
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeTab === 'events' && (
          <EventsManager events={events} onRefresh={() => { loadData(); onDataChange?.(); }} />
        )}
        {activeTab === 'announcements' && (
          <AnnouncementsManager announcements={announcements} onRefresh={() => { loadData(); onDataChange?.(); }} />
        )}
      </div>
    </div>
  )
}

function EventsManager({ events, onRefresh }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    title: '', start_date: '', end_date: '', location: '', responsibility: '', type: 'revival',
  })
  const [saving, setSaving] = useState(false)

  const types = ['camp', 'revival', 'service', 'celebration', 'training', 'meeting']

  const resetForm = () => {
    setForm({ title: '', start_date: '', end_date: '', location: '', responsibility: '', type: 'revival' })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (event) => {
    setForm({
      title: event.title, start_date: event.start_date, end_date: event.end_date,
      location: event.location, responsibility: event.responsibility || '', type: event.type || 'revival',
    })
    setEditing(event.id)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('events').update(form).eq('id', editing)
      } else {
        await supabase.from('events').insert([form])
      }
      resetForm()
      onRefresh()
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    onRefresh()
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
          {events.length} event{events.length !== 1 ? 's' : ''} in calendar
        </p>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} style={{
          padding: '0.6rem 1.25rem', background: 'var(--color-red)', color: '#fff',
          fontSize: '0.8rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer',
        }}>
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {/* Event Form */}
      {showForm && (
        <div style={{
          background: '#fff', padding: '1.5rem', borderRadius: '4px',
          border: '1px solid var(--color-gray-200)', marginBottom: '1.5rem',
        }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
              <div>
                <label style={labelStyle}>Event Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  required style={inputStyle} placeholder="e.g., Revival" />
              </div>
              <div>
                <label style={labelStyle}>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  style={inputStyle}>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
              <div>
                <label style={labelStyle}>Start Date</label>
                <input type="date" value={form.start_date}
                  onChange={e => setForm({ ...form, start_date: e.target.value })}
                  required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input type="date" value={form.end_date}
                  onChange={e => setForm({ ...form, end_date: e.target.value })}
                  required style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
              <div>
                <label style={labelStyle}>Location</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  required style={inputStyle} placeholder="e.g., Gaborone" />
              </div>
              <div>
                <label style={labelStyle}>Responsibility</label>
                <input value={form.responsibility} onChange={e => setForm({ ...form, responsibility: e.target.value })}
                  style={inputStyle} placeholder="e.g., All, Youth, Southern" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={saving} style={{
                padding: '0.6rem 1.5rem', background: 'var(--color-red)', color: '#fff',
                fontSize: '0.8rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer',
              }}>
                {saving ? 'Saving...' : (editing ? 'Update Event' : 'Add Event')}
              </button>
              <button type="button" onClick={resetForm} style={{
                padding: '0.6rem 1.5rem', border: '1px solid var(--color-gray-300)',
                borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', background: '#fff',
                color: 'var(--color-gray-600)',
              }}>
                Cancel
              </button>
            </div>
          </form>
          <style>{`
            @media (max-width: 600px) { .form-row { grid-template-columns: 1fr !important; } }
          `}</style>
        </div>
      )}

      {/* Events Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse', background: '#fff',
          borderRadius: '4px', overflow: 'hidden',
          border: '1px solid var(--color-gray-200)',
        }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-100)' }}>
              {['Title', 'Dates', 'Location', 'Type', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
                  color: 'var(--color-gray-500)', borderBottom: '1px solid var(--color-gray-200)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                <td style={cellStyle}><strong>{event.title}</strong></td>
                <td style={cellStyle}>{event.start_date} &mdash; {event.end_date}</td>
                <td style={cellStyle}>{event.location}</td>
                <td style={cellStyle}>
                  <span style={{
                    padding: '0.15rem 0.5rem', borderRadius: '2px', fontSize: '0.7rem',
                    fontWeight: 600, textTransform: 'uppercase',
                    background: 'var(--color-gray-100)', color: 'var(--color-gray-600)',
                  }}>{event.type}</span>
                </td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(event)} style={{
                      padding: '0.3rem 0.6rem', fontSize: '0.75rem', border: '1px solid var(--color-gray-300)',
                      borderRadius: '3px', cursor: 'pointer', background: '#fff', color: 'var(--color-charcoal)',
                    }}>Edit</button>
                    <button onClick={() => handleDelete(event.id)} style={{
                      padding: '0.3rem 0.6rem', fontSize: '0.75rem', border: '1px solid #FFCDD2',
                      borderRadius: '3px', cursor: 'pointer', background: '#FFF5F5', color: '#C62828',
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AnnouncementsManager({ announcements, onRefresh }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', body: '', active: true })
  const [saving, setSaving] = useState(false)

  const resetForm = () => { setForm({ title: '', body: '', active: true }); setEditing(null); setShowForm(false) }

  const handleEdit = (ann) => {
    setForm({ title: ann.title, body: ann.body, active: ann.active })
    setEditing(ann.id)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('announcements').update(form).eq('id', editing)
      } else {
        await supabase.from('announcements').insert([form])
      }
      resetForm()
      onRefresh()
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    await supabase.from('announcements').delete().eq('id', id)
    onRefresh()
  }

  const toggleActive = async (ann) => {
    await supabase.from('announcements').update({ active: !ann.active }).eq('id', ann.id)
    onRefresh()
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
          {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
        </p>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} style={{
          padding: '0.6rem 1.25rem', background: 'var(--color-red)', color: '#fff',
          fontSize: '0.8rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer',
        }}>
          {showForm ? 'Cancel' : '+ Add Announcement'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#fff', padding: '1.5rem', borderRadius: '4px',
          border: '1px solid var(--color-gray-200)', marginBottom: '1.5rem',
        }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                required style={inputStyle} placeholder="Announcement title" />
            </div>
            <div>
              <label style={labelStyle}>Body</label>
              <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
                required rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Announcement content..." />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.active}
                onChange={e => setForm({ ...form, active: e.target.checked })} />
              Active (visible on site)
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={saving} style={{
                padding: '0.6rem 1.5rem', background: 'var(--color-red)', color: '#fff',
                fontSize: '0.8rem', fontWeight: 600, borderRadius: '4px', cursor: 'pointer',
              }}>
                {saving ? 'Saving...' : (editing ? 'Update' : 'Add Announcement')}
              </button>
              <button type="button" onClick={resetForm} style={{
                padding: '0.6rem 1.5rem', border: '1px solid var(--color-gray-300)',
                borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', background: '#fff',
                color: 'var(--color-gray-600)',
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {announcements.map(ann => (
          <div key={ann.id} style={{
            background: '#fff', padding: '1.25rem 1.5rem', borderRadius: '4px',
            border: '1px solid var(--color-gray-200)',
            opacity: ann.active ? 1 : 0.5,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              gap: '1rem', flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-black)' }}>
                    {ann.title}
                  </h3>
                  <span style={{
                    padding: '0.1rem 0.4rem', borderRadius: '2px', fontSize: '0.6rem',
                    fontWeight: 600, textTransform: 'uppercase',
                    background: ann.active ? '#E8F5E9' : 'var(--color-gray-100)',
                    color: ann.active ? '#2E7D32' : 'var(--color-gray-500)',
                  }}>
                    {ann.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                  {ann.body}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => toggleActive(ann)} style={{
                  padding: '0.3rem 0.6rem', fontSize: '0.75rem', border: '1px solid var(--color-gray-300)',
                  borderRadius: '3px', cursor: 'pointer', background: '#fff', color: 'var(--color-charcoal)',
                }}>{ann.active ? 'Hide' : 'Show'}</button>
                <button onClick={() => handleEdit(ann)} style={{
                  padding: '0.3rem 0.6rem', fontSize: '0.75rem', border: '1px solid var(--color-gray-300)',
                  borderRadius: '3px', cursor: 'pointer', background: '#fff', color: 'var(--color-charcoal)',
                }}>Edit</button>
                <button onClick={() => handleDelete(ann.id)} style={{
                  padding: '0.3rem 0.6rem', fontSize: '0.75rem', border: '1px solid #FFCDD2',
                  borderRadius: '3px', cursor: 'pointer', background: '#FFF5F5', color: '#C62828',
                }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-gray-400)', fontSize: '0.9rem' }}>
            No announcements yet. Add one above.
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '0.7rem 0.85rem', border: '1px solid var(--color-gray-200)',
  borderRadius: '4px', fontSize: '0.88rem', background: '#fff', color: 'var(--color-charcoal)',
  outline: 'none', fontFamily: 'var(--font-body)',
}

const labelStyle = {
  fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-500)',
  letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem',
}

const cellStyle = {
  padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--color-charcoal)',
}
