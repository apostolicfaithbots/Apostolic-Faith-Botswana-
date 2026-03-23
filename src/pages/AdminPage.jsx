import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const inputStyle = { width:'100%', padding:'0.7rem 0.85rem', border:'1px solid var(--color-gray-200)', borderRadius:'4px', fontSize:'0.88rem', background:'#fff', color:'var(--color-charcoal)', outline:'none', fontFamily:'var(--font-body)' }
const labelStyle = { fontSize:'0.68rem', fontWeight:600, color:'var(--color-gray-500)', letterSpacing:'0.08em', textTransform:'uppercase', display:'block', marginBottom:'0.3rem' }
const btnPrimary = { padding:'0.6rem 1.5rem', background:'var(--color-red)', color:'#fff', fontSize:'0.8rem', fontWeight:600, borderRadius:'4px', cursor:'pointer', border:'none' }
const btnSecondary = { padding:'0.6rem 1.5rem', border:'1px solid var(--color-gray-300)', borderRadius:'4px', fontSize:'0.8rem', cursor:'pointer', background:'#fff', color:'var(--color-gray-600)' }
const cellStyle = { padding:'0.6rem 0.75rem', fontSize:'0.82rem', color:'var(--color-charcoal)' }

export default function AdminPage({ onDataChange }) {
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState('events')
  const [data, setData] = useState({ events:[], announcements:[], sermons:[], lessons:[], gallery:[] })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) { setAuthed(true); loadAll() } })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault(); setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
    else { setAuthed(true); loadAll() }
  }

  const loadAll = async () => {
    const [ev,an,se,le,ga] = await Promise.all([
      supabase.from('events').select('*').order('start_date'),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('sermons').select('*').order('date', { ascending: false }),
      supabase.from('lessons').select('*').order('week_date', { ascending: false }),
      supabase.from('gallery').select('*').order('created_at', { ascending: false }),
    ])
    setData({
      events: ev.data||[], announcements: an.data||[], sermons: se.data||[],
      lessons: le.data||[], gallery: ga.data||[],
    })
  }

  const refresh = () => { loadAll(); onDataChange?.() }

  if (!authed) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--color-cream)', padding:'2rem' }}>
      <div style={{ maxWidth:'400px', width:'100%', background:'#fff', padding:'2.5rem', borderRadius:'8px', border:'1px solid var(--color-gray-200)', boxShadow:'0 10px 40px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', color:'var(--color-black)', marginBottom:'0.5rem' }}>Admin Portal</h1>
          <p style={{ fontSize:'0.85rem', color:'var(--color-gray-500)' }}>Sign in to manage church content</p>
        </div>
        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required style={inputStyle} />
          {authError && <div style={{ padding:'0.6rem', background:'#FFEBEE', color:'#C62828', borderRadius:'4px', fontSize:'0.8rem' }}>{authError}</div>}
          <button type="submit" style={btnPrimary}>Sign In</button>
        </form>
      </div>
    </div>
  )

  const tabs = ['events','announcements','sermons','lessons','gallery']

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-cream)', paddingTop:'5rem' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem clamp(1rem,3vw,2rem)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--color-black)' }}>Content Manager</h1>
          <button onClick={async()=>{await supabase.auth.signOut();setAuthed(false)}} style={btnSecondary}>Sign Out</button>
        </div>

        <div style={{ display:'flex', gap:0, marginBottom:'2rem', borderBottom:'2px solid var(--color-gray-200)', overflowX:'auto' }}>
          {tabs.map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:'0.7rem 1.25rem', fontSize:'0.82rem', fontWeight:600, textTransform:'capitalize',
              cursor:'pointer', color: tab===t ? 'var(--color-red)' : 'var(--color-gray-500)',
              borderBottom: tab===t ? '2px solid var(--color-red)' : '2px solid transparent',
              marginBottom:'-2px', background:'none', border:'none', whiteSpace:'nowrap',
              borderBottomStyle:'solid', borderBottomWidth:'2px', borderBottomColor: tab===t ? 'var(--color-red)' : 'transparent',
            }}>{t}</button>
          ))}
        </div>

        {tab === 'events' && <CrudManager table="events" items={data.events} onRefresh={refresh} fields={[
          { key:'title', label:'Title', type:'text', required:true },
          { key:'type', label:'Type', type:'select', options:['camp','revival','service','celebration','training','meeting'] },
          { key:'start_date', label:'Start Date', type:'date', required:true },
          { key:'end_date', label:'End Date', type:'date', required:true },
          { key:'location', label:'Location', type:'text', required:true },
          { key:'responsibility', label:'Responsibility', type:'text' },
        ]} columns={['title','start_date','end_date','location','type']} />}

        {tab === 'announcements' && <CrudManager table="announcements" items={data.announcements} onRefresh={refresh} fields={[
          { key:'title', label:'Title', type:'text', required:true },
          { key:'body', label:'Body', type:'textarea', required:true },
          { key:'active', label:'Active', type:'checkbox' },
        ]} columns={['title','active']} />}

        {tab === 'sermons' && <CrudManager table="sermons" items={data.sermons} onRefresh={refresh} fields={[
          { key:'title', label:'Title', type:'text', required:true },
          { key:'speaker', label:'Speaker', type:'text' },
          { key:'date', label:'Date', type:'date', required:true },
          { key:'scripture_ref', label:'Scripture Reference', type:'text' },
          { key:'description', label:'Description', type:'textarea' },
          { key:'youtube_url', label:'YouTube URL', type:'text' },
          { key:'audio_url', label:'Audio URL', type:'text' },
        ]} columns={['title','speaker','date']} />}

        {tab === 'lessons' && <CrudManager table="lessons" items={data.lessons} onRefresh={refresh} fields={[
          { key:'title', label:'Title', type:'text', required:true },
          { key:'category', label:'Category', type:'select', options:['primary_pals','search','adults','youth','general'], required:true },
          { key:'week_date', label:'Week Date', type:'date' },
          { key:'scripture_ref', label:'Scripture', type:'text' },
          { key:'description', label:'Description', type:'textarea' },
          { key:'content', label:'Content', type:'textarea' },
          { key:'pdf_url', label:'PDF URL', type:'text' },
          { key:'active', label:'Active', type:'checkbox' },
        ]} columns={['title','category','week_date','active']} />}

        {tab === 'gallery' && <CrudManager table="gallery" items={data.gallery} onRefresh={refresh} fields={[
          { key:'image_url', label:'Image URL', type:'text', required:true },
          { key:'title', label:'Title', type:'text' },
          { key:'description', label:'Description', type:'text' },
          { key:'album', label:'Album', type:'text' },
          { key:'featured', label:'Featured', type:'checkbox' },
        ]} columns={['title','album','featured']} />}
      </div>
    </div>
  )
}

function CrudManager({ table, items, onRefresh, fields, columns }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const defaultForm = {}
  fields.forEach(f => {
    if (f.type === 'checkbox') defaultForm[f.key] = true
    else if (f.type === 'select') defaultForm[f.key] = f.options?.[0] || ''
    else defaultForm[f.key] = ''
  })

  const [form, setForm] = useState(defaultForm)

  const resetForm = () => { setForm({...defaultForm}); setEditing(null); setShowForm(false) }

  const handleEdit = (item) => {
    const f = {}
    fields.forEach(fi => { f[fi.key] = item[fi.key] ?? (fi.type === 'checkbox' ? false : '') })
    setForm(f); setEditing(item.id); setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) await supabase.from(table).update(form).eq('id', editing)
      else await supabase.from(table).insert([form])
      resetForm(); onRefresh()
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    await supabase.from(table).delete().eq('id', id)
    onRefresh()
  }

  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
        <p style={{ fontSize:'0.88rem', color:'var(--color-gray-500)' }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
        <button onClick={()=>{ resetForm(); setShowForm(!showForm) }} style={btnPrimary}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div style={{ background:'#fff', padding:'1.5rem', borderRadius:'4px', border:'1px solid var(--color-gray-200)', marginBottom:'1.5rem' }}>
          <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.85rem' }} className="admin-form-grid">
              {fields.map(f => (
                <div key={f.key} style={f.type === 'textarea' ? { gridColumn:'1/-1' } : {}}>
                  <label style={labelStyle}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={form[f.key]||''} onChange={e=>updateField(f.key, e.target.value)}
                      required={f.required} rows={3} style={{...inputStyle, resize:'vertical'}} />
                  ) : f.type === 'select' ? (
                    <select value={form[f.key]||''} onChange={e=>updateField(f.key, e.target.value)} style={inputStyle}>
                      {f.options.map(o => <option key={o} value={o}>{o.replace('_',' ')}</option>)}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.85rem', cursor:'pointer' }}>
                      <input type="checkbox" checked={!!form[f.key]} onChange={e=>updateField(f.key, e.target.checked)} />
                      {form[f.key] ? 'Yes' : 'No'}
                    </label>
                  ) : (
                    <input type={f.type} value={form[f.key]||''} onChange={e=>updateField(f.key, e.target.value)}
                      required={f.required} style={inputStyle} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'0.6rem' }}>
              <button type="submit" disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : (editing ? 'Update' : 'Add')}</button>
              <button type="button" onClick={resetForm} style={btnSecondary}>Cancel</button>
            </div>
          </form>
          <style>{`@media(max-width:600px){.admin-form-grid{grid-template-columns:1fr!important}}`}</style>
        </div>
      )}

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:'4px', overflow:'hidden', border:'1px solid var(--color-gray-200)' }}>
          <thead>
            <tr style={{ background:'var(--color-gray-100)' }}>
              {columns.map(c => (
                <th key={c} style={{ ...cellStyle, textAlign:'left', fontSize:'0.68rem', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600, color:'var(--color-gray-500)', borderBottom:'1px solid var(--color-gray-200)' }}>{c.replace('_',' ')}</th>
              ))}
              <th style={{ ...cellStyle, borderBottom:'1px solid var(--color-gray-200)', fontSize:'0.68rem', fontWeight:600, color:'var(--color-gray-500)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom:'1px solid var(--color-gray-100)' }}>
                {columns.map(c => (
                  <td key={c} style={cellStyle}>
                    {typeof item[c] === 'boolean' ? (
                      <span style={{ padding:'0.1rem 0.4rem', borderRadius:'2px', fontSize:'0.65rem', fontWeight:600,
                        background: item[c] ? '#E8F5E9' : 'var(--color-gray-100)',
                        color: item[c] ? '#2E7D32' : 'var(--color-gray-500)',
                      }}>{item[c] ? 'Yes' : 'No'}</span>
                    ) : (
                      String(item[c] || '').substring(0, 50)
                    )}
                  </td>
                ))}
                <td style={cellStyle}>
                  <div style={{ display:'flex', gap:'0.4rem' }}>
                    <button onClick={()=>handleEdit(item)} style={{ padding:'0.25rem 0.5rem', fontSize:'0.72rem', border:'1px solid var(--color-gray-300)', borderRadius:'3px', cursor:'pointer', background:'#fff' }}>Edit</button>
                    <button onClick={()=>handleDelete(item.id)} style={{ padding:'0.25rem 0.5rem', fontSize:'0.72rem', border:'1px solid #FFCDD2', borderRadius:'3px', cursor:'pointer', background:'#FFF5F5', color:'#C62828' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={columns.length + 1} style={{ ...cellStyle, textAlign:'center', color:'var(--color-gray-400)', padding:'2rem' }}>No items yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
