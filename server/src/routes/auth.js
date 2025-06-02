import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../authMiddleware.js'

const router = express.Router()

router.post('/google', authMiddleware, async (req, res) => {
  try {
    const {email, name} = req.user

    let user = await User.findOne({ where: { email } })

    if (!user) {
        user = await User.create({ email, name })
        console.log('New user created:', user.email)
      }

      return res.status(200).json({ 
        message: 'User authenticated successfully', 
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      })
  } catch (error) {
      console.error('Error during authentication:', error)
      return res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/validate', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true })
})

export default router