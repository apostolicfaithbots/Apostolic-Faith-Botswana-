import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import LivePage from './pages/LivePage'
import SermonsPage from './pages/SermonsPage'
import LessonsPage from './pages/LessonsPage'
import GalleryPage from './pages/GalleryPage'
import EventNotice from './components/EventNotice'
import { supabase } from './lib/supabase'

export default function App() {
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [sermons, setSermons] = useState([])
  const [lessons, setLessons] = useState([])
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      const [evR, anR, seR, leR, gaR] = await Promise.all([
        supabase.from('events').select('*').order('start_date', { ascending: true }),
        supabase.from('announcements').select('*').eq('active', true).order('created_at', { ascending: false }),
        supabase.from('sermons').select('*').order('date', { ascending: false }).limit(20),
        supabase.from('lessons').select('*').eq('active', true).order('week_date', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
      ])
      if (evR.data) setEvents(evR.data)
      if (anR.data) setAnnouncements(anR.data)
      if (seR.data) setSermons(seR.data)
      if (leR.data) setLessons(leR.data)
      if (gaR.data) setGallery(gaR.data)
    } catch {
      setEvents(getFallbackEvents())
    } finally { setLoading(false) }
  }

  return (
    <>
      <EventNotice events={events} />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage events={events} announcements={announcements} sermons={sermons} lessons={lessons} loading={loading} />} />
          <Route path="/events" element={<EventsPage events={events} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/sermons" element={<SermonsPage sermons={sermons} />} />
          <Route path="/lessons" element={<LessonsPage lessons={lessons} />} />
          <Route path="/gallery" element={<GalleryPage gallery={gallery} />} />
          <Route path="/admin" element={<AdminPage onDataChange={fetchData} />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function getFallbackEvents() {
  return [
    { id:1, title:'Revival', start_date:'2026-03-27', end_date:'2026-04-02', location:'Letlhakane', responsibility:'Boteti/Maun', type:'revival' },
    { id:2, title:'SHE Training', start_date:'2026-03-31', end_date:'2026-03-31', location:'Branch/Virtual', responsibility:'Welfare', type:'training' },
    { id:3, title:'Passover', start_date:'2026-04-02', end_date:'2026-04-06', location:'Regional', responsibility:'Regions', type:'service' },
    { id:4, title:'Zambia Camp', start_date:'2026-04-04', end_date:'2026-04-19', location:'Lusaka, Zambia', responsibility:'All', type:'camp' },
    { id:5, title:'Revival', start_date:'2026-05-01', end_date:'2026-05-03', location:'Moshupa', responsibility:'Southern', type:'revival' },
    { id:6, title:'Namibia Camp', start_date:'2026-05-03', end_date:'2026-05-10', location:'Windhoek, Namibia', responsibility:'All', type:'camp' },
    { id:7, title:"Mother's Day Celebration", start_date:'2026-05-08', end_date:'2026-05-10', location:'Gaborone', responsibility:'Mothers', type:'celebration' },
    { id:8, title:'National Youth Camp', start_date:'2026-05-14', end_date:'2026-05-17', location:'Gaborone', responsibility:'Youth', type:'camp' },
    { id:9, title:'Revival', start_date:'2026-05-29', end_date:'2026-05-31', location:'Tsamaya', responsibility:'North East', type:'revival' },
    { id:10, title:"National Children's Day", start_date:'2026-06-06', end_date:'2026-06-06', location:'Branches', responsibility:'Services', type:'celebration' },
    { id:11, title:'Campmeeting Preparation', start_date:'2026-06-13', end_date:'2026-06-13', location:'Gaborone', responsibility:'National Committees', type:'meeting' },
    { id:12, title:"Father's Day", start_date:'2026-06-20', end_date:'2026-06-20', location:'Letlhakane', responsibility:'Men', type:'celebration' },
    { id:13, title:'International Camp', start_date:'2026-06-28', end_date:'2026-07-12', location:'Portland, USA', responsibility:'All', type:'camp' },
    { id:14, title:'Camp Revival', start_date:'2026-07-12', end_date:'2026-07-16', location:'Gaborone', responsibility:'Outreach', type:'revival' },
    { id:15, title:'Botswana Camp', start_date:'2026-07-19', end_date:'2026-07-26', location:'Gaborone', responsibility:'National Committees', type:'camp' },
    { id:16, title:'Revival', start_date:'2026-08-14', end_date:'2026-08-23', location:'Nata', responsibility:'North West', type:'revival' },
    { id:17, title:'Angola Camp', start_date:'2026-08-16', end_date:'2026-08-23', location:'Angola', responsibility:'All', type:'camp' },
    { id:18, title:'Regional Youth Camp', start_date:'2026-08-23', end_date:'2026-08-30', location:'Harare, Zimbabwe', responsibility:'All', type:'camp' },
    { id:19, title:'Mozambique Camp', start_date:'2026-08-30', end_date:'2026-09-06', location:'Chimoio, Mozambique', responsibility:'All', type:'camp' },
    { id:20, title:'Revival', start_date:'2026-09-11', end_date:'2026-09-13', location:'Sese/Jwaneng', responsibility:'Southern', type:'revival' },
    { id:21, title:'South Africa Camp', start_date:'2026-09-27', end_date:'2026-10-04', location:'Bapsfontein, South Africa', responsibility:'All', type:'camp' },
    { id:22, title:'Revival', start_date:'2026-10-23', end_date:'2026-10-25', location:'Mmopane', responsibility:'Southern', type:'revival' },
    { id:23, title:'Revival', start_date:'2026-10-26', end_date:'2026-11-01', location:'Mokoboxane', responsibility:'North West', type:'revival' },
    { id:24, title:'Thanksgiving', start_date:'2026-11-21', end_date:'2026-11-21', location:'National', responsibility:'Regional/Branch', type:'service' },
    { id:25, title:'SEA Camp', start_date:'2026-12-06', end_date:'2026-12-20', location:'Bulawayo, Zimbabwe', responsibility:'All', type:'camp' },
  ]
}
