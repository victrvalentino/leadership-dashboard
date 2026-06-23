'use client'

import ArrayEditor from './ArrayEditor'
import { sectionConfig } from '@/config/sectionConfig'

type Row = Record<string, string | number>

type Props = {
  sectionKey: string
  formData: Record<string, any>
  setFormData: (data: any) => void
  arrayData: Record<string, Row[]>
  setArrayData: (key: string, rows: Row[]) => void
}

export default function DynamicSectionForm({
  sectionKey,
  formData,
  setFormData,
  arrayData,
  setArrayData
}: Props) {
  const config = sectionConfig[sectionKey]

  if (!config) return null

  return (
    <div className="space-y-6">
      {config.fields.map(field =>
        field.type === 'textarea' ? (
          <textarea
            key={field.key}
            rows={4}
            value={formData[field.key] || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [field.key]: e.target.value
              })
            }
            className="w-full border rounded-lg px-4 py-3"
            placeholder={field.label}
          />
        ) : (
          <input
            key={field.key}
            type={field.type === 'number' ? 'number' : 'text'}
            value={formData[field.key] || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [field.key]: e.target.value
              })
            }
            className="w-full border rounded-lg px-4 py-3"
            placeholder={field.label}
          />
        )
      )}

      {config.arrays?.map(arr => (
        <ArrayEditor
          key={arr.key}
          title={arr.title}
          rows={arrayData[arr.key] || []}
          columns={arr.columns}
          onChange={(rows) => setArrayData(arr.key, rows)}
        />
      ))}
    </div>
  )
}