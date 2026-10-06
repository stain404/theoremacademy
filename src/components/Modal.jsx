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
      className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-card backdrop:"
    >
      {open && children}
    </dialog>
  )
}
