import cron from 'node-cron'
import prisma from '../config/db.js'
import { sendWhatsAppMessage } from '../services/whatsappService.js'

// Corre todos os dias às 10h da manhã
cron.schedule('0 10 * * *', async () => {
  console.log('[Reminder Job] A verificar marcações de amanhã...')

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const dayAfter = new Date(tomorrow)
  dayAfter.setDate(dayAfter.getDate() + 1)

  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: tomorrow, lt: dayAfter },
      status: 'confirmed',
      reminderSent: false
    },
    include: { business: true }
  })

  console.log(`[Reminder Job] ${appointments.length} lembretes a enviar`)

  for (const appt of appointments) {
    const hora = appt.date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    try {
      await sendWhatsAppMessage(
        process.env.WHATSAPP_PHONE_NUMBER_ID,
        appt.clientPhone,
        `Lembrete 📅\n\nTem *${appt.service}* marcado amanhã às *${hora}* em *${appt.business.name}*.\n\nAté lá! 👋`
      )
      await prisma.appointment.update({
        where: { id: appt.id },
        data: { reminderSent: true }
      })
    } catch (err) {
      console.error(`Erro ao enviar lembrete para ${appt.clientPhone}:`, err.message)
    }
  }
})
