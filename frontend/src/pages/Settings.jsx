import { useEffect, useState } from 'react'
import { api } from '../services/api'

const BUSINESS_ID = import.meta.env.VITE_BUSINESS_ID || ''

const DAYS = [
  { key: 'mon', label: 'Segunda' },
  { key: 'tue', label: 'Terça' },
  { key: 'wed', label: 'Quarta' },
  { key: 'thu', label: 'Quinta' },
  { key: 'fri', label: 'Sexta' },
  { key: 'sat', label: 'Sábado' },
  { key: 'sun', label: 'Domingo' }
]

export default function Settings() {
  const [business, setBusiness] = useState(null)
  const [services, setServices] = useState([])
  const [newService, setNewService] = useState('')
  const [workingHours, setWorkingHours] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const data = await api.getBusiness(BUSINESS_ID)
        if (!active) return
        if (data?.error) {
          setError('Não foi possível carregar as definições.')
          return
        }
        setBusiness(data)
        setServices(data.services || [])
        setWorkingHours(data.workingHours || {})
      } catch (err) {
        if (active) setError('Não foi possível carregar as definições.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  function addService() {
    const value = newService.trim()
    if (!value || services.includes(value)) return
    setServices(prev => [...prev, value])
    setNewService('')
  }

  function removeService(service) {
    setServices(prev => prev.filter(s => s !== service))
  }

  function toggleDay(dayKey) {
    setWorkingHours(prev => {
      const next = { ...prev }
      if (next[dayKey]) {
        delete next[dayKey]
      } else {
        next[dayKey] = ['09:00', '18:00']
      }
      return next
    })
  }

  function updateHour(dayKey, index, value) {
    setWorkingHours(prev => {
      const current = prev[dayKey] || ['09:00', '18:00']
      const updated = [...current]
      updated[index] = value
      return { ...prev, [dayKey]: updated }
    })
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      await api.updateBusiness(business.id, { services, workingHours })
      setSaved(true)
    } catch (err) {
      setError('Não foi possível guardar as alterações.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Definições</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400 text-sm">
          A carregar...
        </div>
      </div>
    )
  }

  if (error && !business) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Definições</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-500 text-sm">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Definições</h1>

      {/* Serviços */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold mb-4">Serviços</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {services.map(service => (
            <span
              key={service}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 text-sm px-3 py-1.5 rounded-full"
            >
              {service}
              <button
                onClick={() => removeService(service)}
                className="text-blue-400 hover:text-blue-600 leading-none"
                aria-label={`Remover ${service}`}
              >
                ×
              </button>
            </span>
          ))}
          {services.length === 0 && (
            <p className="text-sm text-gray-400">Ainda não há serviços adicionados.</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newService}
            onChange={e => setNewService(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addService()}
            placeholder="Novo serviço (ex: Corte)"
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={addService}
            className="bg-gray-100 hover:bg-gray-200 text-sm font-medium px-4 py-2 rounded-lg"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Horários */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold mb-4">Horário de funcionamento</h2>

        <div className="space-y-2">
          {DAYS.map(day => {
            const isOpen = Boolean(workingHours[day.key])
            const hours = workingHours[day.key] || ['09:00', '18:00']
            return (
              <div key={day.key} className="flex items-center gap-3 py-1.5">
                <label className="flex items-center gap-2 w-32 text-sm">
                  <input
                    type="checkbox"
                    checked={isOpen}
                    onChange={() => toggleDay(day.key)}
                  />
                  {day.label}
                </label>

                {isOpen ? (
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="time"
                      value={hours[0]}
                      onChange={e => updateHour(day.key, 0, e.target.value)}
                      className="border rounded-lg px-2 py-1"
                    />
                    <span className="text-gray-400">até</span>
                    <input
                      type="time"
                      value={hours[1]}
                      onChange={e => updateHour(day.key, 1, e.target.value)}
                      className="border rounded-lg px-2 py-1"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Fechado</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {saved && <p className="text-green-600 text-sm mb-3">Alterações guardadas. </p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'A guardar...' : 'Guardar alterações'}
      </button>
    </div>
  )
}
