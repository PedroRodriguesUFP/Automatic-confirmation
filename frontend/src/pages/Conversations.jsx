import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

const BUSINESS_ID = import.meta.env.VITE_BUSINESS_ID || ''

export default function Conversations() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPhone, setSelectedPhone] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await api.getMessages(BUSINESS_ID)
        if (!active) return
        const list = Array.isArray(data) ? data : []
        setMessages(list)
        if (list.length > 0) {
          setSelectedPhone(prev => prev || list[0].from)
        }
      } catch (err) {
        if (active) setError('Não foi possível carregar as conversas.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  // Agrupa mensagens por número de telefone, com a última mensagem de cada um
  const clients = useMemo(() => {
    const map = new Map()
    for (const msg of messages) {
      const phone = msg.direction === 'inbound' ? msg.from : msg.to || msg.from
      if (!map.has(phone) || new Date(msg.createdAt) > new Date(map.get(phone).createdAt)) {
        map.set(phone, msg)
      }
    }
    return Array.from(map.entries())
      .map(([phone, lastMsg]) => ({ phone, lastMsg }))
      .sort((a, b) => new Date(b.lastMsg.createdAt) - new Date(a.lastMsg.createdAt))
  }, [messages])

  const thread = useMemo(() => {
    if (!selectedPhone) return []
    return messages
      .filter(m => m.from === selectedPhone || m.to === selectedPhone)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }, [messages, selectedPhone])

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Conversas</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-red-500 text-sm">
          {error}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Conversas</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400 text-sm">
          A carregar...
        </div>
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Conversas</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400 text-sm">
          Ainda não há conversas.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Conversas</h1>

      <div className="bg-white rounded-xl shadow-sm flex flex-1 overflow-hidden">
        {/* Lista de clientes */}
        <div className="w-72 border-r overflow-y-auto">
          {clients.map(({ phone, lastMsg }) => (
            <button
              key={phone}
              onClick={() => setSelectedPhone(phone)}
              className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition-colors ${
                selectedPhone === phone ? 'bg-blue-50' : ''
              }`}
            >
              <p className="text-sm font-medium text-gray-800">{phone}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg.body}</p>
            </button>
          ))}
        </div>

        {/* Histórico de mensagens */}
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-3 border-b">
            <p className="text-sm font-medium">{selectedPhone}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {thread.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.direction === 'outbound'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.body}
                  <div
                    className={`text-[10px] mt-1 ${
                      msg.direction === 'outbound' ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
