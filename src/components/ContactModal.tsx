'use client'

import { useEffect, useState } from 'react'
import { X, Mail, MessageCircle } from 'lucide-react'

type Contact = {
  name: string
  email: string
  departments: string[]
  color: string
}

const CONTACTS: Contact[] = [
  {
    name: 'Debora Octaviani Wiguna',
    email: 'debora.wiguna@esb.co.id',
    departments: ['Business Operations'],
    color: '#2563EB',
  },
  {
    name: 'Ilham Haqiqie',
    email: 'ilham.haqiqie@esb.co.id',
    departments: ['Operations Support'],
    color: '#F97316',
  },
  {
    name: 'Vania Natalia',
    email: 'vania.natalia@esb.co.id',
    departments: ['Marketing', 'Technology'],
    color: '#9333EA',
  },
  {
    name: 'Victor Valentino Budianto',
    email: 'victor.valentino@esb.co.id',
    departments: ['CEO Office', 'Finance & Legal', 'People Experience'],
    color: '#0F1B4D',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMounted(true))
      document.body.style.overflow = 'hidden'
    } else {
      setMounted(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className={
          'absolute inset-0 bg-slate-900/45 backdrop-blur-[3px] transition-opacity duration-300 ' +
          (mounted ? 'opacity-100' : 'opacity-0')
        }
        onClick={onClose}
      />

      <div
        className={
          'relative bg-white rounded-[28px] shadow-2xl max-w-[440px] w-full p-8 transition-all duration-300 ease-out ' +
          (mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2')
        }
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" strokeWidth={2.25} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center icon-gradient shadow-badge" style={{ backgroundColor: '#0D1B4B' }}>
            <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.75} />
          </div>
        </div>

        <h2 className="text-center text-[19px] font-extrabold text-gray-900 tracking-tight">
          Need Help? Contact Your PBX Representative
        </h2>
        <p className="text-center text-[13px] text-gray-500 font-medium mt-1.5 mb-6 leading-relaxed">
          For further questions, reach out to the representative aligned to
          your department.
        </p>

        <div className="space-y-2.5">
          {CONTACTS.map((c) => (
            <a
              key={c.email}
              href={`mailto:${c.email}`}
              className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors group"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-extrabold icon-gradient shadow-soft"
                style={{ backgroundColor: c.color }}
              >
                {initials(c.name)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-bold text-gray-900 truncate">{c.name}</p>
                <p className="text-[11px] text-gray-500 font-medium truncate">
                  {c.departments.join(' · ')}
                </p>
              </div>

              <Mail
                className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors"
                strokeWidth={2}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
