import prisma from '../config/db.js'

export const getBusiness = async (req, res) => {
  const business = await prisma.business.findUnique({
    where: { slug: req.params.slug }
  })
  if (!business) return res.status(404).json({ error: 'Negócio não encontrado' })
  res.json(business)
}

export const updateBusiness = async (req, res) => {
  const business = await prisma.business.update({
    where: { id: req.params.id },
    data: req.body
  })
  res.json(business)
}
