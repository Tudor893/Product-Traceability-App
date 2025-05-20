import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../authMiddleware.js'

const router = express.Router()

router.put('/details', authMiddleware, async (req, res) => {
  try {
      const { uic, companyName, companyRole } = req.body
      const email = req.user.email

      let user = await User.findOne({ where: { email } })
      if (!user) {
          return res.status(404).json({ message: 'User not found' })
      }

      await user.update({ cui: uic, companyName, role: companyRole, detailsCompleted: true })

      res.status(200).json({ message: 'User details updated' })
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/status', authMiddleware, async (req, res) => {
  try {
      const email = req.user.email
      const user = await User.findOne({ where: { email } })

      if (!user) {
          return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json(user)
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
  }
})

export default router