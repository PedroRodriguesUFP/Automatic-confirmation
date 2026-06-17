// TODO Semana 2: cards com marcações do dia, mensagens novas, stats
export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Hoje</h1>
      <p className="text-gray-500 mb-6">Resumo do dia</p>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Marcações hoje</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Mensagens novas</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Lembretes enviados</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
      </div>
    </div>
  )
}
