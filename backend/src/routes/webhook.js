import express from 'express'
import { verifyWebhook, handleMessage } from '../controllers/webhookController.js'

const router = express.Router()

// Meta verifica o webhook com GET
router.get('/', verifyWebhook)

// Mensagens chegam por POST
router.post('/', handleMessage)

export default router
