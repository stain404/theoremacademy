export const HERO_SCENES = [
  {
    id: 'india',
    name: 'India Campus',
    location: 'Mumbai BKC & Financial Hub',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2000&q=85',
    tagline: 'Structured Trading Labs • Financial Hub, India',
    session: 'India Market Session (Active)',
    badge: 'India Hub',
    tz: 'IST (UTC+5:30)',
  },
  {
    id: 'dubai',
    name: 'Dubai Campus',
    location: 'Business Bay & DIFC',
    flag: '🇦🇪',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85',
    tagline: 'Physical Trading Floor • Business Bay, Dubai',
    session: 'Dubai Market Session (Active)',
    badge: 'UAE Flagship Campus',
    tz: 'GST (UTC+4)',
  },
  {
    id: 'online',
    name: 'Live Online',
    location: 'Interactive Live Classrooms',
    flag: '🌐',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=2000&q=85',
    tagline: 'Interactive Screen Sharing & 1-on-1 Reviews',
    session: '24/7 Global Orderflow',
    badge: 'Live Online Cohort',
    tz: 'Global Timezones',
  },
]

export default function HeroVisualBackground({ activeScene = 'india' }) {
  const active = HERO_SCENES.find((s) => s.id === activeScene) || HERO_SCENES[0]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#07070a]">
      {/* Atmospheric Scenic Background Layers with Smooth Crossfade */}
      {HERO_SCENES.map((scene) => (
        <div
          key={scene.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out filter brightness-100 contrast-115 will-change-[opacity] transform-gpu ${
            scene.id === active.id ? 'opacity-42' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${scene.image}')` }}
          aria-hidden="true"
        />
      ))}

      {/* Directional Contrast Gradient: Solid obsidian on left for crystal-clear text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070a]/95 via-[#07070a]/75 to-[#07070a]/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07070a]/60 via-transparent to-[#09090b]" />

      {/* Subtle Micro-Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,215,0,0.5) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  )
}
