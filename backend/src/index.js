import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import appointmentRoutes from './routes/appointments.js'
import webhookRoutes from './routes/webhook.js'
import businessRoutes from './routes/business.js'
import './jobs/reminderJob.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/appointments', appointmentRoutes)
app.use('/api/business', businessRoutes)
app.use('/webhook', webhookRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`AutoFlow backend a correr na porta ${PORT}`)
})
