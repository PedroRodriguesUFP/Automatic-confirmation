import { useParams } from 'react-router-dom'

// Página pública tipo autoflow.pt/b/joao-barbeiro
// O dono partilha este link no Instagram/WhatsApp
// TODO Semana 3: formulário de marcação + integração com API
export default function BookingPage() {
  const { slug } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">✂️</div>
          <h1 className="text-2xl font-bold">Fazer Marcação</h1>
          <p className="text-gray-400 text-sm mt-1">@{slug}</p>
        </div>
        <div className="text-center text-gray-400 text-sm">
          Formulário de marcação — Semana 3
        </div>
      </div>
    </div>
  )
}
