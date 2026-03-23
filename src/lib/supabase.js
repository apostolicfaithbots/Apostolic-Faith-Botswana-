import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://msgpqwhrtisqtgmavblb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zZ3Bxd2hydGlzcXRnbWF2YmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjg1OTEsImV4cCI6MjA4OTgwNDU5MX0.eb0XvDoUCJ5AY53V70O3R6o1U3PB0m56kovwBz9H3pQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
