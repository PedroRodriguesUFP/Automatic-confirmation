import express from 'express'
import { getBusiness, updateBusiness } from '../controllers/businessController.js'

const router = express.Router()

router.get('/:slug', getBusiness)
router.put('/:id', updateBusiness)

export default router
