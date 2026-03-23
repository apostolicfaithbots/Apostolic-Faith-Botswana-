# Apostolic Faith Botswana - Church Website

A modern, professional church website for the Apostolic Faith Tabernacle in Gaborone, Botswana. Built with React, Vite, GSAP animations, and Supabase for dynamic content management.

## Features

- **Modern Design** - Clean, professional aesthetic with GSAP scroll animations
- **Events Calendar** - Full 2026 events calendar with live event detection and countdown timers
- **Event Notices** - Floating notification that automatically shows upcoming/live events
- **Admin Portal** - Full CRUD management for events and announcements (Supabase auth)
- **Live Services** - YouTube embed + Zoom/Facebook links
- **Contact Form** - Messages stored in Supabase
- **Responsive** - Fully mobile-friendly
- **GitHub Pages** - Automated deployment via GitHub Actions

## Tech Stack

- **React 18** + Vite
- **Supabase** (Free tier) - Database, Auth, API
- **GSAP** - Scroll-triggered animations
- **React Router** - Client-side routing (HashRouter for GitHub Pages)
- **date-fns** - Date formatting
- **react-icons** - Icon library

## Setup

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and open your project
2. Navigate to **SQL Editor**
3. Paste and run the contents of `supabase-setup.sql`
4. Go to **Authentication > Users** and create an admin user (email/password)

### 2. Local Development

```bash
npm install
npm run dev
```

### 3. Deploy to GitHub Pages

The site auto-deploys when you push to `main`. Make sure:

1. GitHub repo Settings > Pages > Source is set to **GitHub Actions**
2. Push your code to the `main` branch
3. The workflow will build and deploy automatically

### 4. Admin Access

Navigate to `/#/admin` and sign in with your Supabase admin credentials.

From the admin panel you can:
- Add, edit, and delete events
- Create and manage announcements
- Toggle announcement visibility

## Project Structure

```
src/
  components/
    Header.jsx      - Navigation with mobile menu
    Footer.jsx      - Site footer with links and socials
    EventNotice.jsx - Floating event countdown/live banner
  pages/
    HomePage.jsx    - Landing page with hero, events, about
    EventsPage.jsx  - Full events calendar with filters
    AboutPage.jsx   - Church history and beliefs
    ContactPage.jsx - Contact form and service info
    LivePage.jsx    - YouTube embed and connection links
    AdminPage.jsx   - Content management portal
  hooks/
    useGsap.js      - GSAP scroll animation hooks
  lib/
    supabase.js     - Supabase client
  styles/
    global.css      - Global styles and CSS variables
```

## Customization

- **Colors**: Edit CSS variables in `src/styles/global.css`
- **Images**: Replace files in `public/images/`
- **Content**: Use the admin panel at `/#/admin`
- **Supabase**: Update credentials in `src/lib/supabase.js`

---

*Apostolic Faith Mission of Portland, Oregon - Botswana*
