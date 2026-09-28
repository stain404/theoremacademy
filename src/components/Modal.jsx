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
      className="m-auto w-[min(27rem,calc(100%-2rem))] rounded-[3px] bg-paper p-0 text-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)] backdrop:bg-board/70"
    >
      {open && children}
    </dialog>
  )
}
