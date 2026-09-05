const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Neck({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="15" r="8" {...stroke} />
      <path d="M24 28c-6 2-9 5-10 10h36c-1-5-4-8-10-10-2 4-4 6-8 6s-6-2-8-6Z" {...stroke} />
      <path d="M32 44v14M32 44c0-8-4-12-8-14M32 44c0-8 4-12 8-14" {...stroke} opacity="0.55" />
      <path d="M18 58h28" {...stroke} opacity="0.4" />
    </svg>
  )
}

function Shoulder({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <path d="M16 20c-5 4-8 9-8 16M48 20c5 4 8 9 8 16" {...stroke} />
      <path d="M20 20h24c-4 6-6 12-6 20v14H26V40c0-8-2-14-6-20Z" {...stroke} />
      <path d="M26 30c-5 2-7 4-8 8M38 30c5 2 7 4 8 8" {...stroke} opacity="0.55" />
      <path d="M10 44a22 22 0 0 0 44 0" {...stroke} opacity="0.35" />
    </svg>
  )
}

function Spine({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <path d="M32 12v40" {...stroke} />
      <path d="M24 16h16M23 26h18M22 36h20M24 46h16" {...stroke} opacity="0.7" />
      <path d="M20 6l-8 8M44 6l8 8" {...stroke} opacity="0.45" />
      <path d="M32 52c-6 0-10 4-11 8M32 52c6 0 10 4 11 8" {...stroke} opacity="0.45" />
    </svg>
  )
}

function Legs({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <rect x="20" y="6" width="24" height="20" rx="8" {...stroke} />
      <path d="M22 26c-2 6-4 14-6 24l-4 8M42 26c2 6 4 14 6 24l4 8" {...stroke} />
      <path d="M18 58h8M38 58h8" {...stroke} opacity="0.45" />
      <path d="M36 10h6" {...stroke} opacity="0.6" />
    </svg>
  )
}

function Hip({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <path d="M20 8v14M44 8v14" {...stroke} />
      <rect x="16" y="20" width="32" height="16" rx="8" {...stroke} />
      <path d="M24 40l-6 16M40 40l6 16M28 44v6M36 44v6" {...stroke} opacity="0.7" />
      <path d="M16 36c-6 2-9 5-10 10h8" {...stroke} opacity="0.45" />
    </svg>
  )
}

function Hands({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <path d="M14 18c0-8 8-8 8-4v14" {...stroke} />
      <path d="M22 16c0-8 8-8 8-4v18M30 16c0-8 8-8 8-4v14" {...stroke} />
      <path d="M38 18c0-8 8-8 8-4v14" {...stroke} />
      <path d="M18 26h22c5 0 6 6 0 8l-14 4c-6 2-12-2-10-8 1-4 3-4 2-4Z" {...stroke} />
      <path d="M14 40l4 12h28l4-12" {...stroke} opacity="0.45" />
    </svg>
  )
}

function Stretch({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="12" r="7" {...stroke} />
      <path d="M28 22c-4 3-7 7-8 12M36 22c4 3 7 7 8 12" {...stroke} opacity="0.6" />
      <path d="M26 36c-2 4-2 9-2 14M38 36c2 4 2 9 2 14" {...stroke} opacity="0.5" />
      <path d="M30 36h4M28 50h2M34 50h2" {...stroke} opacity="0.5" />
      <path d="M10 12l6 6M54 12l-6 6" {...stroke} opacity="0.4" />
    </svg>
  )
}

function Full({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="10" r="6" {...stroke} />
      <path d="M26 20h12l-2 10-4 2-4-2-2-10Z" {...stroke} />
      <path d="M28 32l-6 18M36 32l6 18M24 46l-6 10M40 46l6 10" {...stroke} />
      <path d="M12 24c6-2 10 0 12 4M52 24c-6-2-10 0-12 4" {...stroke} opacity="0.5" />
    </svg>
  )
}

export default function ExerciseIcon({ name, className = 'w-full h-full' }) {
  const icons = { neck: Neck, shoulder: Shoulder, spine: Spine, legs: Legs, hip: Hip, hands: Hands, stretch: Stretch, full: Full }
  const Icon = icons[name] || Full
  return <Icon className={className} />
}
