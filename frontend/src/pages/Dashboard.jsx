import { useEffect, useState } from 'react'
import { api } from '../services/api'

// TODO: substituir por businessId real (vindo de auth/contexto) quando existir login
const BUSINESS_ID = import.meta.env.VITE_BUSINESS_ID || ''

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await api.getAppointments(BUSINESS_ID, todayISO())
        if (active) setAppointments(Array.isArray(data) ? data : [])
      } catch (err) {
        if (active) setError('Não foi possível carregar as marcações.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const confirmadas = appointments.filter(a => a.status === 'confirmed').length
  const canceladas = appointments.filter(a => a.status === 'cancelled').length

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Hoje</h1>
      <p className="text-gray-500 mb-6">Resumo do dia</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Marcações hoje</p>
          <p className="text-3xl font-bold mt-1">{loading ? '—' : appointments.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Confirmadas</p>
          <p className="text-3xl font-bold mt-1">{loading ? '—' : confirmadas}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Canceladas</p>
          <p className="text-3xl font-bold mt-1">{loading ? '—' : canceladas}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold">Marcações de hoje</h2>
        </div>

        {error && (
          <div className="p-6 text-center text-red-500 text-sm">{error}</div>
        )}

        {!error && loading && (
          <div className="p-8 text-center text-gray-400 text-sm">A carregar...</div>
        )}

        {!error && !loading && appointments.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">
            Sem marcações para hoje.
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
