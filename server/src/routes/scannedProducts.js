import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../authMiddleware.js'
import FarmerProduct from '../models/FarmerProduct.js'
import ScannedProductByProcessor from '../models/ScannedProductByProcessor.js'
import ScannedProductByDistributor from '../models/ScannedProductByDistributor.js'
import ProcessorProduct from '../models/ProcessorProduct.js'
import ScannedProductByStore from '../models/ScannedProductByStore.js'
import ScannedProductByClient from '../models/ScannedProductByClient.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, sender } = req.body

    const userEmail = req.user.email
    const user = await User.findOne({ where: { email: userEmail } })
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost gasit' })
    }
    const userId = user.id
    const userRole = user.role.replace(/[ăâ]/g, "a")
                              .replace(/[î]/g, "i")
                              .replace(/[ș]/g, "s")
                              .replace(/[ț]/g, "t")
                              .toLowerCase()

    if(userRole === "procesator"){

      const product = await FarmerProduct.findByPk(productId)
      if (!product) {
        return res.status(404).json({ message: 'Produsul nu a fost gasit' })
      }

      const existingScan = await ScannedProductByProcessor.findOne({
        where: { productId }
      })
      
      if (existingScan) {
        return res.status(400).json({ message: 'Produs deja scanat' })
      }

      const scannedProduct = await ScannedProductByProcessor.create({
        userId,
        productId
      })
      
      res.status(201).json({
        message: 'Product scanned successful',
        data: scannedProduct
      });
    }else if(userRole === "distribuitor" || userRole === 'magazin' || userRole === 'client'){

      if(sender === "fermier"){

        const product = await FarmerProduct.findByPk(productId)
        if (!product) {
          return res.status(404).json({ message: 'Produsul nu a fost gasit' })
        }

        let existingScan;
        if(userRole === 'distribuitor'){ 
          existingScan = await ScannedProductByDistributor.findOne({
            where: { farmerProductId: productId,
              userId
             }
        })}else if(userRole === 'magazin'){
            existingScan = await ScannedProductByStore.findOne({
              where: { farmerProductId: productId,
                userId
               }
          })}else if(userRole === 'client'){
            existingScan = await ScannedProductByClient.findOne({
              where: { farmerProductId: productId,
                userId
               }
          })}
        
        if (existingScan) {
          return res.status(400).json({ message: 'Produs deja scanat' })
        }

        let scannedProduct;
        if(userRole === 'distribuitor'){
         scannedProduct = await ScannedProductByDistributor.create({
          userId,
          farmerProductId: productId,
          processorProductId: null
        })}else if(userRole === 'magazin'){
          scannedProduct = await ScannedProductByStore.create({
            userId,
            farmerProductId: productId,
            processorProductId: null
          })}else if(userRole === 'client'){
            scannedProduct = await ScannedProductByClient.create({
              userId,
              farmerProductId: productId,
              processorProductId: null
            })}
        
        res.status(201).json({
          message: 'Product scanned successful',
          data: scannedProduct,
          role: userRole
        })
      }else if(sender === "procesator"){
        const product = await ProcessorProduct.findByPk(productId)
        if (!product) {
          return res.status(404).json({ message: 'Produsul nu a fost gasit' })
        }

        let existingScan;
        if(userRole === 'distribuitor'){ 
          existingScan = await ScannedProductByDistributor.findOne({
            where: { processorProductId: productId,
              userId
             }
        })}else if(userRole === 'magazin'){
            existingScan = await ScannedProductByStore.findOne({
              where: { processorProductId: productId,
                userId
               }
          })}else if(userRole === 'client'){
            existingScan = await ScannedProductByClient.findOne({
              where: { processorProductId: productId,
                userId
               }
          })}
        
        if (existingScan) {
          return res.status(400).json({ message: 'Produs deja scanat' })
        }

        let scannedProduct;
        if(userRole === 'distribuitor'){
         scannedProduct = await ScannedProductByDistributor.create({
          userId,
          farmerProductId: null,
          processorProductId: productId
        })}else if(userRole === 'magazin'){
          scannedProduct = await ScannedProductByStore.create({
            userId,
            farmerProductId: null,
            processorProductId: productId
          })}else if(userRole === 'client'){
            scannedProduct = await ScannedProductByClient.create({
              userId,
              farmerProductId: null,
              processorProductId: productId
            })}
        
        res.status(201).json({
          message: 'Product scanned successful',
          data: scannedProduct,
          role: userRole
        })
      }
    }
  } catch (error) {
    console.error('Error registering product:', error)
    res.status(500).json({ message: 'Request error' })
  }
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email
    const user = await User.findOne({ where: { email: userEmail } })
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost gasit' })
    }

    const userRole = user.role.replace(/[ăâ]/g, "a")
                              .replace(/[î]/g, "i")
                              .replace(/[ș]/g, "s")
                              .replace(/[ț]/g, "t")
                              .toLowerCase()

    if(userRole === "procesator"){
      const scannedProducts = await ScannedProductByProcessor.findAll({
        where: { userId: user.id },
        include: [{
          model: FarmerProduct,
          as: 'farmerProduct',
          required: false
        }],
        order: [['createdAt', 'DESC']]
      })
      res.status(200).json(scannedProducts)
    }else if(userRole === "distribuitor"){
      const scannedProductsByDistributor = await ScannedProductByDistributor.findAll({
        where: { userId: user.id },
        include: [{
          model: FarmerProduct,
          as: 'farmerProduct',
          required: false
        },
        {
          model: ProcessorProduct,
          as: 'processorProduct',
          required: false
        }],
        order: [['createdAt', 'DESC']]
      })
      res.status(200).json(scannedProductsByDistributor)
    }else if(userRole === 'magazin'){
      const scannedProductsByStore = await ScannedProductByStore.findAll({
        where: { userId: user.id },
        include: [{
          model: FarmerProduct,
          as: 'farmerProduct',
          required: false
        },
        {
          model: ProcessorProduct,
          as: 'processorProduct',
          required: false
        }],
        order: [['createdAt', 'DESC']]
      })
      res.status(200).json(scannedProductsByStore)
    }
  } catch (error) {
    console.error('Error fetching scanned products:', error)
    res.status(500).json({ message: 'Eroare la preluarea produselor scanate' })
  }
})

export default router