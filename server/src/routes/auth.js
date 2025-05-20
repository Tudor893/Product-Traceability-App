import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../authMiddleware.js'

const router = express.Router()

router.post('/google', async (req, res) => {
  const {email, name} = req.body

  if (!email || !name) {
    return res.status(400).json({ message: 'Email and name are required' })
}
  try {
    let user = await User.findOne({ where: { email } })

    if (!user) {
      user = await User.create({ email, name })
    }

    return res.status(200).json({ message: 'User authenticated', user })
  } catch (error) {
      console.error('Error during authentication:', error)
      return res.status(500).json({ message: 'Internal server error' })
}})

router.get('/validate', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true })
})

export default router