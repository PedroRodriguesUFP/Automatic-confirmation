import prisma from '../config/db.js'

export const getAppointments = async (req, res) => {
  const { businessId } = req.params
  const { date } = req.query

  const where = { businessId }
  if (date) {
    const day = new Date(date)
    const next = new Date(day)
    next.setDate(next.getDate() + 1)
    where.date = { gte: day, lt: next }
  }

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { date: 'asc' }
  })
  res.json(appointments)
}

export const createAppointment = async (req, res) => {
  const { businessId } = req.params
  const { clientName, clientPhone, service, date } = req.body
  const appointment = await prisma.appointment.create({
    data: { businessId, clientName, clientPhone, service, date: new Date(date) }
  })
  res.status(201).json(appointment)
}

export const cancelAppointment = async (req, res) => {
  const { id } = req.params
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: 'cancelled' }
  })
  res.json(appointment)
}
