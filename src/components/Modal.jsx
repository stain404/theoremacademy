import { useEffect, useRef } from 'react'

// Accessible dialog built on the native <dialog> element (focus trap + Esc for free).
export default function Modal({ open, onClose, children, labelledBy }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-2xl border border-white/20 bg-[#141417] p-0 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {open && children}
    </dialog>
  )
}
