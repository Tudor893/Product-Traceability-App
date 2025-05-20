import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../authMiddleware.js'
import ProcessorProduct from '../models/ProcessorProduct.js'
import ProcessorFarmerProduct from '../models/ProcessorFarmerProduct.js'

const router = express.Router()

router.post('/products', authMiddleware, async (req, res) => {
  try {
      const { 
          productName,
          batch,
          quantity,
          unit,
          productionDate,
          expirationDate,
          storageConditions,
          cost,
          notes,
          selectedIngredients
      } = req.body

      const userEmail = req.user.email
      const user = await User.findOne({ where: { email: userEmail } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userId = user.id;
  
      if (!productName || !batch || !quantity || !unit || !productionDate || !expirationDate || !cost || !storageConditions || !selectedIngredients) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const processorProduct = await ProcessorProduct.create({
          userId: userId,
          productName,
          batch,
          productionDate,
          expirationDate,
          quantity,
          unit,
          cost,
          storageConditions,
          notes: notes || null
      })

      if (selectedIngredients && selectedIngredients.length > 0) {
          const associations = selectedIngredients.map(ingredient => {
              const farmerProductId = ingredient.farmerProduct.id

              return {
                  processorProductId: processorProduct.id,
                  farmerProductId: farmerProductId
              }
          })

          await ProcessorFarmerProduct.bulkCreate(associations)
      }

      return res.status(201).json({
          success: true,
          message: 'Produsul a fost adăugat cu succes!',
          product: processorProduct
      })
  } catch (error) {
      console.error('Error creating processor product:', error)
      return res.status(500).json({
          success: false,
          message: 'A apărut o eroare la adăugarea produsului.',
          error: error.message
      })
  }
})

router.get('/products', authMiddleware, async (req, res) => {
  try {
      const userEmail = req.user.email
      const user = await User.findOne({ where: { email: userEmail } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      const userId = user.id

      const products = await ProcessorProduct.findAll({
          where: { userId: userId },
          order: [['createdAt', 'DESC']]
      })

      return res.status(200).json(products)
  } catch (error) {
      console.error('Error fetching processor products:', error)
      return res.status(500).json({
          success: false,
          message: 'A apărut o eroare la obținerea produselor.',
          error: error.message
      })
  }
})

export default router