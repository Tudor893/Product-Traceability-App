import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../authMiddleware.js'
import FarmerProduct from '../models/FarmerProduct.js'

const router = express.Router()

router.post('/products', authMiddleware, async (req, res) => {
  try {
    const {
      productName,
      category,
      quantity,
      unit,
      batch,
      cost,
      harvestDate,
      location,
      bio,
      description
    } = req.body

    const userEmail = req.user.email
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userId = user.id;

    if (!productName || !category || !quantity || !unit || !batch || !harvestDate || !location || !bio) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const existingProduct = await FarmerProduct.findOne({
      where: {
        userId,
        batch
      }
    })

    if (existingProduct) {
      return res.status(409).json({ message: 'Produsul cu acest lot există deja' })
    }

    const newProduct = await FarmerProduct.create({
      userId,
      productName,
      category,
      quantity,
      unit,
      batch,
      cost: cost || null,
      harvestDate,
      location,
      bio: bio === "1" ? true : false,
      description: description || null
    })

    res.status(201).json({ 
      message: 'Product added successfully', 
      product: newProduct 
    })
  } catch (error) {
    console.error('Error adding product:', error)
    res.status(500).json({ message: 'Internal server error' })
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
    
    const products = await FarmerProduct.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    })

    res.status(200).json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router