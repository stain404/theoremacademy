// The homepage hero's video stage: one slot per way to study (Dubai, online, India).
// Slots and their files are configured in config/site.js (heroSlots).
import { useCallback, useEffect, useRef, useState } from 'react'
import { heroSlots } from '../config/site'
import { localTime, useNow } from './Board'

const STILL_MS = 6500 // how long a slot without video stays on screen
const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/*
  Behaviour:
  - Plays each slot in turn. A video slot advances when its clip ends; a still slot after STILL_MS.
  - The active tab's hairline fills with playback progress. It is written straight to the DOM
    through refs, so progress never re-renders React.
  - Visitors can pick a slot, or pause. With reduced motion nothing plays: posters only,
    and the tabs simply switch the picture.
*/
export default function HeroStage({ slots = heroSlots }) {
  const reduced = useRef(prefersReducedMotion()).current
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(!reduced)
  const videoRef = useRef(null)
  const bars = useRef([])
  const elapsed = useRef(0) // ms into a still slot, so pausing resumes where it stopped
  const now = useNow(30_000)
  const slot = slots[active]
  const hasVideo = Boolean(slot.video) && !reduced

  const setProgress = (p) => {
    bars.current.forEach((el, i) => el && (el.style.transform = `scaleX(${i === active ? p : 0})`))
  }

  const next = useCallback(() => {
    elapsed.current = 0
    setActive((i) => (i + 1) % slots.length)
  }, [slots.length])

  const select = (i) => {
    elapsed.current = 0
    setActive(i)
  }

  // Still slots: a timer that drives the hairline and advances at the end.
  useEffect(() => {
    if (hasVideo || !playing) return
    let raf
    let last = performance.now()
    const tick = (t) => {
      elapsed.current += t - last
      last = t
      setProgress(Math.min(elapsed.current / STILL_MS, 1))
      if (elapsed.current >= STILL_MS) return next()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playing, hasVideo, next])

  // Video slots: play or pause with the control, and follow the clip's own progress.
  useEffect(() => {
    const v = videoRef.current
    if (!hasVideo || !v) return
    if (playing) v.play().catch(() => setPlaying(false)) // autoplay blocked: show the play control
    else v.pause()
  }, [active, playing, hasVideo])

  useEffect(() => {
    if (!playing && !hasVideo) setProgress(elapsed.current / STILL_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const onTime = (e) => {
    const v = e.currentTarget
    if (v.duration) setProgress(v.currentTime / v.duration)
  }

  return (
    <div>
      <div className="stage-open relative aspect-[16/10] overflow-hidden rounded-[var(--radius-stage)] bg-board shadow-[var(--shadow-lift)]">
        {slots.map((s, i) => (
          <div key={s.id} className={`slot-layer absolute inset-0 ${i === active ? 'opacity-100' : 'opacity-0'}`} aria-hidden={i !== active}>
            <img src={s.poster} alt="" className="h-full w-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            {i === active && hasVideo && (
              <video
                key={s.id}
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                autoPlay={playing}
                preload="auto"
                poster={s.poster}
                onTimeUpdate={onTime}
                onEnded={next}
              >
                {s.videoMobile && <source src={s.videoMobile} type="video/mp4" media="(max-width: 767px)" />}
                <source src={s.video} type="video/mp4" />
              </video>
            )}
          </div>
        ))}

        {/* caption sits on a soft shade at the bottom of the frame */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgb(8_17_14/0.7),transparent)]" />
        <p className="absolute bottom-4 left-5 text-sm font-medium text-white sm:bottom-5 sm:left-6" aria-live="polite">
          {slot.caption}
        </p>

        {!reduced && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="absolute right-4 bottom-3.5 grid size-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 sm:right-5 sm:bottom-4"
          >
            <span className="sr-only">{playing ? 'Pause the campus videos' : 'Play the campus videos'}</span>
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M4.5 2.8v10.4L13 8z" />}
            </svg>
          </button>
        )}
      </div>

      <div role="tablist" aria-label="Where you can study" className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        {slots.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => select(i)}
            className={`group relative overflow-hidden rounded-[var(--radius-ctl)] px-3 pt-3 pb-2.5 text-left transition-colors sm:px-4 ${i === active ? 'bg-card' : 'hover:bg-card'}`}
          >
            <span className="absolute inset-x-3 top-0 h-0.5 overflow-hidden rounded-full bg-line sm:inset-x-4" aria-hidden="true">
              <span
                ref={(el) => (bars.current[i] = el)}
                className="block h-full origin-left bg-brand"
                style={{ transform: `scaleX(${reduced && i === active ? 1 : 0})` }}
              />
            </span>
            <span className={`block truncate text-sm font-semibold ${i === active ? 'text-ink' : 'text-ink-soft group-hover:text-ink'}`}>
              <span className="sm:hidden">{s.short}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </span>
            <span className="block truncate text-xs text-ink-soft tabular-nums">
              {s.tz ? <>{localTime(now, s.tz)}<span className="hidden sm:inline"> local time</span></> : 'Live on Zoom'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
