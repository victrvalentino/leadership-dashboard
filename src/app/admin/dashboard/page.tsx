'use client'

import { useEffect, useState } from 'react'
import DynamicSectionForm from '@/components/admin/DynamicSectionForm'
import { sectionConfig } from '@/config/sectionConfig'

type Row = Record<string, string | number>

const SECTION_LABELS: Record<string, string> = {
  executive: 'Executive Snapshot',
  entry: 'Entry',
  experience: 'Experience',
  development: 'Development',
  turnover: 'Turnover',
  exit: 'Exit',
  cost: 'Cost',
  riskHeatmap: 'Risk Heatmap',
  actionBox: 'Action Box',
  governance: 'Governance'
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return null

  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)')
  )

  return match ? decodeURIComponent(match[2]) : null
}

export default function AdminDashboardPage() {
  const sectionKeys = Object.keys(sectionConfig)

  const [selectedSection, setSelectedSection] = useState(sectionKeys[0])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [arrayData, setArrayDataState] = useState<Record<string, Row[]>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    setRole(getCookie('user-role'))
    setUserName(getCookie('user-name') || '')
  }, [])

  const setArrayData = (key: string, rows: Row[]) => {
    setArrayDataState((prev) => ({
      ...prev,
      [key]: rows
    }))
  }

  const handleSectionChange = (section: string) => {
    setFormData({})
    setArrayDataState({})
    setSelectedSection(section)
  }

  const loadSectionData = async (section: string) => {
    try {
      setLoading(true)

      const res = await fetch(`/api/admin/sections?section=${section}`)
      const result = await res.json()

      if (result?.content) {
        const content = result.content
        const sectionArrays = sectionConfig[section]?.arrays || []
        const extractedArrays: Record<string, Row[]> = {}

        sectionArrays.forEach((arr) => {
          extractedArrays[arr.key] = content[arr.key] || []
        })

        const scalarData = { ...content }

        sectionArrays.forEach((arr) => {
          delete scalarData[arr.key]
        })

        setFormData(scalarData)
        setArrayDataState(extractedArrays)
      } else {
        setFormData({})
        setArrayDataState({})
      }
    } catch (error) {
      console.error(error)
      alert('Failed to load section')
    } finally {
      setLoading(false)
    }
  }

  const submitData = async (publish = false) => {
    if (role === 'viewer') {
      alert('Viewer cannot modify CMS')
      return
    }

    try {
      setSaving(true)

      const payload = {
        section_key: selectedSection,
        content: {
          ...formData,
          ...arrayData
        },
        publish
      }

      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error()

      alert(
        publish
          ? 'Section published successfully'
          : 'Draft saved successfully'
      )
    } catch (error) {
      console.error(error)
      alert('Action failed')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadSectionData(selectedSection)
  }, [selectedSection])

  if (role === 'viewer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold mb-3">Access Denied</h1>
          <p className="text-gray-500">
            Viewer role cannot access CMS
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: '#0D1B4B' }}
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-80 bg-white shadow border-r p-6">
        <a
          href="/"
          className="mb-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
          style={{ backgroundColor: '#0D1B4B' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Dashboard
        </a>

        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            ESB Leadership CMS
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Dashboard Sections
          </p>

          {role && (
            <div className="mt-4 text-xs">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {role}
              </span>
            </div>
          )}

          {userName && (
            <p className="text-xs text-gray-400 mt-2">
              {userName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          {sectionKeys.map((section) => (
            <button
              key={section}
              onClick={() => handleSectionChange(section)}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${
                selectedSection === section
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {SECTION_LABELS[section] || section}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow border p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold">
                Edit Section
              </h2>

              <p className="text-gray-500">
                {SECTION_LABELS[selectedSection]}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => submitData(false)}
                disabled={saving}
                className="px-5 py-3 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-50"
              >
                Save Draft
              </button>

              <button
                onClick={() => submitData(true)}
                disabled={saving}
                className="px-5 py-3 rounded-xl bg-green-600 text-white font-medium disabled:opacity-50"
              >
                Publish
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500">
              Loading...
            </div>
          ) : (
            <DynamicSectionForm
              sectionKey={selectedSection}
              formData={formData}
              setFormData={setFormData}
              arrayData={arrayData}
              setArrayData={setArrayData}
            />
          )}
        </div>
      </main>
    </div>
  )
}