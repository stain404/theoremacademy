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
      className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-xl bg-card p-0 text-ink shadow-2xl backdrop:bg-ink/50"
    >
      {open && children}
    </dialog>
  )
}
