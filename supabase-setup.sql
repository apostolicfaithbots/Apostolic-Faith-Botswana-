-- ============================================
-- Apostolic Faith Botswana - Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT NOT NULL,
  responsibility TEXT,
  type TEXT DEFAULT 'revival' CHECK (type IN ('camp', 'revival', 'service', 'celebration', 'training', 'meeting')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermons table (for future use)
CREATE TABLE IF NOT EXISTS sermons (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT,
  date DATE NOT NULL,
  description TEXT,
  youtube_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view published content)
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Active announcements are viewable by everyone"
  ON announcements FOR SELECT
  USING (true);

CREATE POLICY "Sermons are viewable by everyone"
  ON sermons FOR SELECT
  USING (true);

-- Contact messages: anyone can insert
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Admin write policies (authenticated users only)
CREATE POLICY "Authenticated users can manage events"
  ON events FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage announcements"
  ON announcements FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage sermons"
  ON sermons FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage contact messages"
  ON contact_messages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed data: 2026 Calendar Events
-- ============================================

INSERT INTO events (title, start_date, end_date, location, responsibility, type) VALUES
  ('National Committees Meeting', '2026-01-24', '2026-01-24', 'Mahalapye', 'National Committees', 'meeting'),
  ('National Youth Retreat', '2026-02-20', '2026-02-22', 'Francistown', 'Youths', 'camp'),
  ('Revival', '2026-03-06', '2026-03-08', 'Selebi Phikwe & Molepolole', 'Central + Greater Phikwe', 'revival'),
  ('Lesotho Camp', '2026-03-08', '2026-03-15', 'Maseru, Lesotho', 'All', 'camp'),
  ('Campmeeting Prep', '2026-03-19', '2026-03-19', 'Virtual', 'Committees', 'meeting'),
  ('Revival', '2026-03-20', '2026-03-22', 'Jackalas 1', 'North East', 'revival'),
  ('Revival', '2026-03-27', '2026-04-02', 'Letlhakane', 'Boteti/Maun', 'revival'),
  ('SHE Training', '2026-03-31', '2026-03-31', 'Branch/Virtual', 'Welfare', 'training'),
  ('Passover', '2026-04-02', '2026-04-06', 'Regional', 'Regions', 'service'),
  ('Zambia Camp', '2026-04-04', '2026-04-19', 'Lusaka, Zambia', 'All', 'camp'),
  ('Revival', '2026-05-01', '2026-05-03', 'Moshupa', 'Southern', 'revival'),
  ('Namibia Camp', '2026-05-03', '2026-05-10', 'Windhoek, Namibia', 'All', 'camp'),
  ('Mother''s Day Celebration', '2026-05-08', '2026-05-10', 'Gaborone', 'Mothers', 'celebration'),
  ('National Youth Camp', '2026-05-14', '2026-05-17', 'Gaborone', 'Youth', 'camp'),
  ('Revival', '2026-05-29', '2026-05-31', 'Tsamaya', 'North East', 'revival'),
  ('National Children''s Day', '2026-06-06', '2026-06-06', 'Branches', 'Services', 'celebration'),
  ('Campmeeting Preparation', '2026-06-13', '2026-06-13', 'Gaborone', 'National Committees', 'meeting'),
  ('Father''s Day', '2026-06-20', '2026-06-20', 'Letlhakane', 'Men', 'celebration'),
  ('International Camp', '2026-06-28', '2026-07-12', 'Portland, USA', 'All', 'camp'),
  ('Camp Revival', '2026-07-12', '2026-07-16', 'Gaborone', 'Outreach', 'revival'),
  ('Botswana Camp', '2026-07-19', '2026-07-26', 'Gaborone', 'National Committees', 'camp'),
  ('Revival', '2026-08-01', '2026-08-01', 'Sebina', 'North West', 'revival'),
  ('Malawi Camp', '2026-08-02', '2026-08-09', 'Blantyre, Malawi', 'All', 'camp'),
  ('Eswatini / Burundi Camp', '2026-08-09', '2026-08-16', 'Eswatini', 'All', 'camp'),
  ('Revival', '2026-08-14', '2026-08-23', 'Nata', 'North West', 'revival'),
  ('Angola Camp', '2026-08-16', '2026-08-23', 'Angola', 'All', 'camp'),
  ('Regional Youth Camp', '2026-08-23', '2026-08-30', 'Harare, Zimbabwe', 'All', 'camp'),
  ('Revival', '2026-08-24', '2026-08-30', 'Rakops', 'Boteti/Maun', 'revival'),
  ('Revival', '2026-08-29', '2026-08-29', 'Mahalapye', 'Central', 'revival'),
  ('Mozambique Camp', '2026-08-30', '2026-09-06', 'Chimoio, Mozambique', 'All', 'camp'),
  ('Revival', '2026-09-11', '2026-09-13', 'Sese/Jwaneng', 'Southern', 'revival'),
  ('SHE Personnel Training', '2026-09-15', '2026-09-15', 'Branches', 'Services', 'training'),
  ('South Africa Camp', '2026-09-27', '2026-10-04', 'Bapsfontein, South Africa', 'All', 'camp'),
  ('Revival', '2026-10-23', '2026-10-25', 'Mmopane', 'Southern', 'revival'),
  ('Revival', '2026-10-26', '2026-11-01', 'Mokoboxane', 'North West', 'revival'),
  ('Thanksgiving', '2026-11-21', '2026-11-21', 'National', 'Regional/Branch', 'service'),
  ('SEA Camp', '2026-12-06', '2026-12-20', 'Bulawayo, Zimbabwe', 'All', 'camp')
ON CONFLICT DO NOTHING;
