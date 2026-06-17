import { sendWhatsAppMessage } from './whatsappService.js'

// Estados da conversa por número de telefone (em memória)
// Semana 3: migrar para Redis para persistir entre restarts
const conversationState = {}

export const processIncomingMessage = async (message, phoneNumberId) => {
  const from = message.from
  const text = message.text?.body?.toLowerCase().trim()

  if (!text) return

  const state = conversationState[from] || { step: 'idle' }

  // Passo 1 — trigger de marcação
  if (
    state.step === 'idle' &&
    (text.includes('marcar') || text.includes('marcação') || text.includes('agendar'))
  ) {
    conversationState[from] = { step: 'awaiting_service' }
    await sendWhatsAppMessage(
      phoneNumberId,
      from,
      'Olá! 👋 Que serviço pretende marcar?\n\nResponda com o número:\n1 - Corte\n2 - Barba\n3 - Corte + Barba'
    )
    return
  }

  // Passo 2 — escolha de serviço
  if (state.step === 'awaiting_service') {
    const services = { '1': 'Corte', '2': 'Barba', '3': 'Corte + Barba' }
    const service = services[text]
    if (!service) {
      await sendWhatsAppMessage(phoneNumberId, from, 'Por favor responda com 1, 2 ou 3.')
      return
    }
    conversationState[from] = { step: 'awaiting_datetime', service }
    await sendWhatsAppMessage(
      phoneNumberId,
      from,
      `Ótimo! *${service}* selecionado. ✂️\n\nPara que dia e hora?\nEx: _Sexta às 15h_`
    )
    return
  }

  // Passo 3 — data e hora
  if (state.step === 'awaiting_datetime') {
    // TODO: Semana 3 — parsing de data com date-fns + verificar conflitos no calendar
    conversationState[from] = { step: 'awaiting_name', datetime: text, service: state.service }
    await sendWhatsAppMessage(phoneNumberId, from, 'Qual é o seu nome?')
    return
  }

  // Passo 4 — nome e confirmação
  if (state.step === 'awaiting_name') {
    const { service, datetime } = state
    conversationState[from] = { step: 'idle' }
    // TODO: guardar na base de dados com prisma
    await sendWhatsAppMessage(
      phoneNumberId,
      from,
      `✅ Marcado!\n\n*Serviço:* ${service}\n*Quando:* ${datetime}\n*Nome:* ${text}\n\nRecebe lembrete na véspera. Até lá! 👋`
    )
    return
  }

  // Mensagem não reconhecida
  await sendWhatsAppMessage(
    phoneNumberId,
    from,
    'Olá! 👋 Para fazer uma marcação escreva *"quero marcar"*. 📅'
  )
}
