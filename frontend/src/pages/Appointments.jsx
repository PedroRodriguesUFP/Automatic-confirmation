import { useEffect, useState } from 'react'
import { api } from '../services/api'

const BUSINESS_ID = import.meta.env.VITE_BUSINESS_ID || ''

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export default function Appointments() {
  const [date, setDate] = useState(todayISO())
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await api.getAppointments(BUSINESS_ID, date)
        if (active) setAppointments(Array.isArray(data) ? data : [])
      } catch (err) {
        if (active) setError('Não foi possível carregar as marcações.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [date])

  async function handleCancel(id) {
    setCancellingId(id)
    try {
      await api.cancelAppointment(id)
      setAppointments(prev =>
        prev.map(a => (a.id === id ? { ...a, status: 'cancelled' } : a))
      )
    } catch (err) {
      setError('Não foi possível cancelar a marcação.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Marcações</h1>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {error && (
          <div className="p-6 text-center text-red-500 text-sm">{error}</div>
        )}

        {!error && loading && (
          <div className="p-8 text-center text-gray-400 text-sm">A carregar...</div>
        )}

        {!error && !loading && appointments.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">
            Sem marcações para este dia.
          </div>
        )}

        {!error && !loading && appointments.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="px-5 py-3 font-medium">Serviço</th>
                <th className="px-5 py-3 font-medium">Hora</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="px-5 py-3">{a.clientName}</td>
                  <td className="px-5 py-3">{a.service}</td>
                  <td className="px-5 py-3">
                    {new Date(a.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    {a.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(a.id)}
                        disabled={cancellingId === a.id}
                        className="text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        {cancellingId === a.id ? 'A cancelar...' : 'Cancelar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-500',
    completed: 'bg-gray-100 text-gray-500'
  }
  const labels = {
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Concluída'
  }
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[status] || styles.completed}`}>
      {labels[status] || status}
    </span>
  )
}
