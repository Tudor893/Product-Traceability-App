import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../authMiddleware.js'
import StoreInformation from '../models/StoreInformation.js'
import FarmerProduct from '../models/FarmerProduct.js'
import ProcessorProduct from '../models/ProcessorProduct.js'

const router = express.Router()

router.post('/information', authMiddleware, async (req, res) => {
  try {
      const { 
          operatorName,
          quantity,
          notes,
          storageTemperature,
          storageCondition,
          otherStorageDetails,
          selectedProduct
      } = req.body

      const userEmail = req.user.email
      const user = await User.findOne({ where: { email: userEmail } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      const userId = user.id
  
      if (!selectedProduct || selectedProduct.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Trebuie să selectați cel puțin un produs'
        })
      }

      const product = selectedProduct[0]
      
      const farmerProductId = product.farmerProduct?.id || null
      const processorProductId = product.processorProduct?.id || null

        if (!farmerProductId && !processorProductId) {
            return res.status(400).json({
                success: false,
                message: 'Produsul selectat nu are un ID valid'
            })
        }

        if (!operatorName) {
          return res.status(400).json({
              success: false,
              message: 'Numele operatorului este obligatoriu'
          })
      }

        if (!quantity) {
            return res.status(400).json({
                success: false,
                message: 'Cantitatea si greutatea sunt obligatorii'
            })
        }

        if (!storageTemperature || !storageCondition) {
            return res.status(400).json({
                success: false,
                message: 'Toate detaliile de depozitare sunt obligatorii cand produsele sunt depozitate'
            })
        }

        if (storageCondition === 'other' && !otherStorageDetails) {
            return res.status(400).json({
                success: false,
                message: 'Detaliile suplimentare sunt obligatorii pentru alte tipuri de depozitare'
            })
        }

        let existingStoreInfo;
        if(farmerProductId){
           existingStoreInfo = await StoreInformation.findOne({
            where: {
              userId,
              farmerProductId
            }
          })
        }else if(processorProductId){
          existingStoreInfo = await StoreInformation.findOne({
            where: {
              userId,
              processorProductId
            }
          })
        }
        if(existingStoreInfo){
          return res.status(409).json({
            success: false,
            message: 'Exista deja informatii salvate pentru acest produs'
          })
        }

        const storeInfo = await StoreInformation.create({
            userId,
            farmerProductId,
            processorProductId,
            operatorName,
            quantity,
            storageTemperature: storageTemperature,
            storageCondition: storageCondition,
            otherStorageDetails: storageCondition === 'other' ? otherStorageDetails : null,
            notes: notes || null
        })

        return res.status(201).json({
            success: true,
            message: 'Informatiile despre produs au fost salvate cu succes',
            storeInfo
        })
    } catch (error) {
        console.error('Error creating store information:', error)
        return res.status(500).json({
            success: false,
            message: 'A aparut o eroare la salvarea informatiilor',
            error: error.message
        })
    }
})

router.get('/information', authMiddleware, async (req, res) => {
  try {
      const userEmail = req.user.email
      const user = await User.findOne({ where: { email: userEmail } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      const userId = user.id
      
      const storeInfo = await StoreInformation.findAll({
        where: { userId: userId },
        include: [
          { model: FarmerProduct,
            as: "farmerProduct"
           }, 
          { model: ProcessorProduct,
            as: "processorProduct" }
        ],
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json(storeInfo)
  } catch (error) {
      console.error('Error fetching store information:', error)
      return res.status(500).json({
          success: false,
          message: 'A aparut o eroare la preluarea informatiilor',
          error: error.message  
      })
  }
})

export default router