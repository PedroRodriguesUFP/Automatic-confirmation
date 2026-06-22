import { sendWhatsAppMessage } from './whatsappService.js'
import prisma from '../config/db.js'

const conversationState = {}

// Busca o negócio uma vez e guarda em cache
let cachedBusiness = null
const getBusiness = async () => {
  if (cachedBusiness) return cachedBusiness
  cachedBusiness = await prisma.business.findFirst()
  return cachedBusiness
}

const parseDate = (text) => {
  const days = { 'segunda': 1, 'terça': 2, 'quarta': 3, 'quinta': 4, 'sexta': 5, 'sabado': 6, 'sábado': 6, 'domingo': 0 }
  const now = new Date()
  let date = new Date()

  // Encontrar o dia
  for (const [day, num] of Object.entries(days)) {
    if (text.includes(day)) {
      const diff = (num - now.getDay() + 7) % 7 || 7
      date.setDate(now.getDate() + diff)
      break
    }
  }

  // Encontrar a hora
  const horaMatch = text.match(/(\d{1,2})h/)
  if (horaMatch) {
    date.setHours(parseInt(horaMatch[1]), 0, 0, 0)
  }

  return date
}

export const processIncomingMessage = async (message, phoneNumberId) => {
  const from = message.from
  const text = message.text?.body?.toLowerCase().trim()

  if (!text) return

  const state = conversationState[from] || { step: 'idle' }

  if (
    state.step === 'idle' &&
    (text.includes('marcar') || text.includes('marcação') || text.includes('agendar'))
  ) {
    conversationState[from] = { step: 'awaiting_service' }
    await sendWhatsAppMessage(phoneNumberId, from,
      'Olá! 👋 Que serviço pretende marcar?\n\nResponda com o número:\n1 - Corte\n2 - Barba\n3 - Corte + Barba'
    )
    return
  }

  if (state.step === 'awaiting_service') {
    const services = { '1': 'Corte', '2': 'Barba', '3': 'Corte + Barba' }
    const service = services[text]
    if (!service) {
      await sendWhatsAppMessage(phoneNumberId, from, 'Por favor responda com 1, 2 ou 3.')
      return
    }
    conversationState[from] = { step: 'awaiting_datetime', service }
    await sendWhatsAppMessage(phoneNumberId, from,
      `Ótimo! *${service}* selecionado. ✂️\n\nPara que dia e hora?\nEx: _Sexta às 15h_`
    )
    return
  }

  if (state.step === 'awaiting_datetime') {
    const date = parseDate(text)
    conversationState[from] = { step: 'awaiting_name', datetime: date, service: state.service }
    await sendWhatsAppMessage(phoneNumberId, from, 'Qual é o seu nome?')
    return
  }

  if (state.step === 'awaiting_name') {
    const { service, datetime } = state
    const business = await getBusiness()

    try {
      await prisma.appointment.create({
        data: {
          businessId: business.id,
          clientName: text,
          clientPhone: from,
          service,
          date: datetime
        }
      })
    } catch (err) {
      console.error('Erro ao guardar marcação:', err.message)
    }

    conversationState[from] = { step: 'idle' }
    const hora = datetime.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    const dia = datetime.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })
    await sendWhatsAppMessage(phoneNumberId, from,
      `✅ Marcado!\n\n*Serviço:* ${service}\n*Quando:* ${dia} às ${hora}\n*Nome:* ${text}\n\nRecebe lembrete na véspera. Até lá! 👋`
    )
    return
  }

  await sendWhatsAppMessage(phoneNumberId, from,
    'Olá! 👋 Para fazer uma marcação escreva *"quero marcar"*. 📅'
  )
}