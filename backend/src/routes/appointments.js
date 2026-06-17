import express from 'express'
import {
  getAppointments,
  createAppointment,
  cancelAppointment
} from '../controllers/appointmentController.js'

const router = express.Router()

router.get('/:businessId', getAppointments)
router.post('/:businessId', createAppointment)
router.patch('/:id/cancel', cancelAppointment)

export default router
