import { processIncomingMessage } from '../services/botService.js'

// Verificação do webhook pela Meta
export const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verificado com sucesso')
    return res.status(200).send(challenge)
  }
  return res.sendStatus(403)
}

// Receber mensagens do WhatsApp
export const handleMessage = async (req, res) => {
  try {
    const body = req.body
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0]
      const change = entry?.changes?.[0]
      const message = change?.value?.messages?.[0]

      if (message) {
        await processIncomingMessage(message, change.value.metadata.phone_number_id)
      }
    }
    res.sendStatus(200)
  } catch (err) {
    console.error('Erro no webhook:', err)
    res.sendStatus(500)
  }
}
