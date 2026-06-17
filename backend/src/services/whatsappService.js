export const sendWhatsAppMessage = async (phoneNumberId, to, message) => {
  const response = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message }
      })
    }
  )

  if (!response.ok) {
    const err = await response.json()
    console.error('Erro WhatsApp API:', err)
    throw new Error('Falha ao enviar mensagem')
  }

  return response.json()
}
