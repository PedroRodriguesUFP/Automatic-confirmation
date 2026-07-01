import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'

const initialForm = {
  clientName: '',
  clientPhone: '',
  service: '',
  date: '',
  time: ''
}

export default function BookingPage() {
  const { slug } = useParams()

  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [confirmed, setConfirmed] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const data = await api.getBusiness(slug)
        if (!active) return
        if (!data || data.error) {
          setNotFound(true)
        } else {
          setBusiness(data)
        }
      } catch (err) {
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [slug])

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setSubmitError(null)

    if (!form.clientName || !form.clientPhone || !form.service || !form.date || !form.time) {
      setSubmitError('Por favor preenche todos os campos.')
      return
    }

    setSubmitting(true)
    try {
      const isoDate = new Date(`${form.date}T${form.time}:00`).toISOString()
      const result = await api.createAppointment(business.id, {
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        service: form.service,
        date: isoDate
      })

      if (result?.error) {
        setSubmitError('Não foi possível concluir a marcação. Tenta novamente.')
        return
      }

      setConfirmed({ ...form })
    } catch (err) {
      setSubmitError('Não foi possível concluir a marcação. Tenta novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PageShell slug={slug}>
        <div className="text-center text-gray-400 text-sm py-8">A carregar...</div>
      </PageShell>
    )
  }

  if (notFound) {
    return (
      <PageShell slug={slug}>
        <div className="text-center text-gray-500 text-sm py-8">
          Não encontrámos este negócio. Verifica o link e tenta novamente.
        </div>
      </PageShell>
    )
  }

  if (confirmed) {
    return (
      <PageShell slug={slug} businessName={business.name}>
        <div className="text-center py-4">
          <div className="text-4xl mb-3"></div>
          <h2 className="text-lg font-semibold mb-1">Marcação confirmada!</h2>
          <p className="text-gray-500 text-sm mb-4">
            {confirmed.service} · {new Date(`${confirmed.date}T${confirmed.time}`).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })} às {confirmed.time}
          </p>
          <p className="text-gray-400 text-xs">
            Vais receber um lembrete por WhatsApp na véspera. 
          </p>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell slug={slug} businessName={business.name}>
      <div className="space-y-4">
        {business.services?.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {business.services.map(s => (
              <span key={s} className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                {s}
              </span>
            ))}
          </div>
        )}

        <Field label="Nome">
          <input
            type="text"
            value={form.clientName}
            onChange={e => handleChange('clientName', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="O teu nome"
          />
        </Field>

        <Field label="Telefone">
          <input
            type="tel"
            value={form.clientPhone}
            onChange={e => handleChange('clientPhone', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="+351 9XX XXX XXX"
          />
        </Field>

        <Field label="Serviço">
          <select
            value={form.service}
            onChange={e => handleChange('service', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Escolhe um serviço</option>
            {(business.services || []).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Data">
            <input
              type="date"
              value={form.date}
              onChange={e => handleChange('date', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Hora">
            <input
              type="time"
              value={form.time}
              onChange={e => handleChange('time', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </Field>
        </div>

        {submitError && (
          <p className="text-red-500 text-xs">{submitError}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'A marcar...' : 'Confirmar marcação'}
        </button>
      </div>
    </PageShell>
  )
}

function PageShell({ slug, businessName, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">✂️</div>
          <h1 className="text-2xl font-bold">{businessName || 'Fazer Marcação'}</h1>
          <p className="text-gray-400 text-sm mt-1">@{slug}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
