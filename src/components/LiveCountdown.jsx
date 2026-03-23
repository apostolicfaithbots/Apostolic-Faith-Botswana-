import { useState, useEffect } from 'react'

// Shared hook for live ticking time
export function useNow(interval = 1000) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

// Calculate countdown parts
export function getCountdown(targetDate, now) {
  const diff = targetDate - now
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

// Styled live countdown display
export default function LiveCountdown({ targetDate, now, size = 'md', light = false }) {
  const cd = getCountdown(targetDate, now)
  if (!cd) return null

  const sizes = {
    sm: { digit: '0.95rem', label: '0.5rem', pad: '0.3rem 0.45rem', gap: '0.3rem' },
    md: { digit: '1.2rem', label: '0.55rem', pad: '0.4rem 0.55rem', gap: '0.4rem' },
    lg: { digit: '1.8rem', label: '0.6rem', pad: '0.5rem 0.75rem', gap: '0.5rem' },
  }
  const s = sizes[size] || sizes.md

  const bgColor = light ? 'rgba(255,255,255,0.12)' : 'var(--color-gray-100)'
  const digitColor = light ? '#fff' : 'var(--color-black)'
  const labelColor = light ? 'rgba(255,255,255,0.5)' : 'var(--color-gray-400)'
  const sepColor = light ? 'rgba(255,255,255,0.3)' : 'var(--color-gray-300)'

  const units = []
  if (cd.days > 0) units.push({ value: cd.days, label: 'Days' })
  units.push({ value: cd.hours, label: 'Hrs' })
  units.push({ value: cd.minutes, label: 'Min' })
  units.push({ value: cd.seconds, label: 'Sec' })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      {units.map((u, i) => (
        <div key={u.label} style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
          {i > 0 && <span style={{ color: sepColor, fontSize: s.digit, fontWeight: 300, lineHeight: 1 }}>:</span>}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: bgColor,
              borderRadius: '4px',
              padding: s.pad,
              fontFamily: 'var(--font-body)',
              fontSize: s.digit,
              fontWeight: 700,
              color: digitColor,
              lineHeight: 1,
              minWidth: u.label === 'Days' ? 'auto' : '2ch',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
            }}>
              {String(u.value).padStart(2, '0')}
            </div>
            <div style={{
              fontSize: s.label,
              color: labelColor,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              marginTop: '0.2rem',
            }}>{u.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
