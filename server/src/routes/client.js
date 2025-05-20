import express from 'express'
import User from '../models/User.js'
import authMiddleware from '../authMiddleware.js'
import StoreInformation from '../models/StoreInformation.js'
import FarmerProduct from '../models/FarmerProduct.js'
import ProcessorProduct from '../models/ProcessorProduct.js'
import ScannedProductByStore from '../models/ScannedProductByStore.js'
import ScannedProductByDistributor from '../models/ScannedProductByDistributor.js'
import DistributorInformation from '../models/DistributorInformation.js'
import ProcessorFarmerProduct from '../models/ProcessorFarmerProduct.js'
import ScannedProductByClient from '../models/ScannedProductByClient.js'
import CompanyInformation from '../models/CompanyInformation.js'
import Comment from '../models/Comment.js'

const router = express.Router()

async function getCompanyInfoByUserId(userId) {
  const userData = await User.findOne({
    where: {
      id: userId
    }
  })

  if(userData){
    return await CompanyInformation.findOne({
      where: {
        uic: String(userData.cui)
      }
    })
  }
  return null
}

async function farmerHistory(data, id) {
  //Store
  const scannedProductByStore = await ScannedProductByStore.findOne({
    where: {
      farmerProductId: id
    }})

    if(scannedProductByStore){
      data.store.scannedByStore = true
      data.store.scannedAt = scannedProductByStore.createdAt
      const storeInfo = await StoreInformation.findOne({
        where: {
          farmerProductId: id
        }
      })
      if (storeInfo) {
        data.store.productData = storeInfo
        data.store.companyInfo = await getCompanyInfoByUserId(storeInfo.userId)
      }
    }

    //Distributor
    const scannedProductByDistributor = await ScannedProductByDistributor.findOne({
      where: {
        farmerProductId: id
      }})

      if(scannedProductByDistributor){
        data.distributor.scannedByDistributor = true
        data.distributor.scannedAt = scannedProductByDistributor.createdAt
        const distributorInfo = await DistributorInformation.findOne({
          where: {
            farmerProductId: id
          }
        })
        if (distributorInfo) {
          data.distributor.productData = distributorInfo
          data.distributor.companyInfo = await getCompanyInfoByUserId(distributorInfo.userId)
        }
      }

    //Client
    const farmerInfo = await FarmerProduct.findOne({
      where: {
        id: id
      }
    })
    if (farmerInfo) {
      data.farmer.productData = farmerInfo
      data.farmer.companyInfo = await getCompanyInfoByUserId(farmerInfo.userId)
    }
    return data
}

async function processorHistory(data, id) {
  //Store
  const scannedProductByStore = await ScannedProductByStore.findOne({
    where: {
      processorProductId: id
    }})

    if(scannedProductByStore){
      data.store.scannedByStore = true
      data.store.scannedAt = scannedProductByStore.createdAt
      const storeInfo = await StoreInformation.findOne({
        where: {
          processorProductId: id
        }
      })
      if (storeInfo) {
        data.store.productData = storeInfo
        data.store.companyInfo = await getCompanyInfoByUserId(storeInfo.userId)
      }
    }

    //Distributor
    const scannedProductByDistributor = await ScannedProductByDistributor.findOne({
      where: {
        processorProductId: id
      }})

      if(scannedProductByDistributor){
        data.distributor.scannedByDistributor = true
        data.distributor.scannedAt = scannedProductByDistributor.createdAt
        const distributorInfo = await DistributorInformation.findOne({
          where: {
            processorProductId: id
          }
        })
        if (distributorInfo) {
          data.distributor.productData = distributorInfo
          data.distributor.companyInfo = await getCompanyInfoByUserId(distributorInfo.userId)
        }
      }
    
    //Processor
      const processorInfo = await ProcessorProduct.findOne({
        where: {
          id: id
        }
      })
      if (processorInfo) {
        data.processor.productData = processorInfo
        data.processor.companyInfo = await getCompanyInfoByUserId(processorInfo.userId)
      }

    //Farmer productss
    const farmerProducts = await ProcessorFarmerProduct.findAll({
      where: {
        processorProductId: id
      }
    })

    if(farmerProducts && farmerProducts.length > 0){
      const farmerProductIds = farmerProducts.map(fp => fp.farmerProductId)

      const farmerProductsData = await FarmerProduct.findAll({
        where: {
          id: farmerProductIds
        }
      })

      if(farmerProductsData && farmerProductsData.length > 0){
        const completedFarmerProducts = await Promise.all(
          farmerProductsData.map(async (product) => {
            const companyInfo = await getCompanyInfoByUserId(product.userId)
              return {
                ...product.toJSON(),
                companyInfo
              }
            })
        )
        data.farmer.productData = completedFarmerProducts
        data.farmer.companyInfo = completedFarmerProducts.map(product => product.companyInfo)
      }
    }
    return data
}

router.get('/product-history/:sender?/:id?', authMiddleware, async (req, res) => {
  try {
    let data = {
      store: {
        scannedByStore: false,
        productData: null,
        scannedAt: null,
        companyInfo: null
      },
      distributor:{
        scannedByDistributor: false,
        productData: null,
        scannedAt: null,
        companyInfo: null
      },
      processor: {
        productData: null,
        companyInfo: null
      },
      farmer: {
        productData: null,
        companyInfo: null
      }
    }

    const {sender, id} = req.params

    const userEmail = req.user.email
    const user = await User.findOne({ where: { email: userEmail } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const userId = user.id

    let lastRecord

    if(!sender && !id){
       lastRecord = await ScannedProductByClient.findOne({
        where: {userId: userId},
        order: [['createdAt', 'DESC']]
      })
    }else if(sender && id){
      if(sender === 'fermier'){
         lastRecord = await ScannedProductByClient.findOne({
          where: {
            userId: userId,
            farmerProductId: id
          }
        })
      }else if(sender === 'procesator'){
         lastRecord = await ScannedProductByClient.findOne({
          where: {
            userId: userId,
            processorProductId: id
          }
        })
      }
    }

    if (!lastRecord) {
      return res.status(404).json({message: 'No records found'})
    }
    
    if(lastRecord.farmerProductId){
      data = await farmerHistory(data, lastRecord.farmerProductId)

      }else if(lastRecord.processorProductId){
        data = await processorHistory(data, lastRecord.processorProductId)
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching last record:', error)
    res.status(500).json({message: 'Internal server error'})
  }
})


router.get('/scanned-products', authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email
    const user = await User.findOne({ where: { email: userEmail } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const userId = user.id

    const products = await ScannedProductByClient.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: FarmerProduct,
            as: 'farmerProduct',
            attributes: ['productName']
          },
          {
            model: ProcessorProduct,
            as: 'processorProduct',
            attributes: ['productName']
          }
        ]
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

router.post('/comments', authMiddleware, async (req, res) => {
  const { farmerProductId, processorProductId, message } = req.body
  const userEmail = req.user.email

  if (!message || (!farmerProductId && !processorProductId)) {
    return res.status(400).json({message: 'Missing required fields'})
  }

  try {
    const user = await User.findOne({ where: { email: userEmail } })
    if (!user) {
      return res.status(404).json({message: 'User not found'})
    }

    const newComment = await Comment.create({
      userId: user.id,
      farmerProductId: farmerProductId || null,
      processorProductId: processorProductId || null,
      message,
    })

    res.status(201).json({message: 'Comment added'})
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({message: 'Internal server error'})
  }
})

router.get('/comments', async (req, res) => {
  const { farmerProductId, processorProductId } = req.query
  
  if (!farmerProductId && !processorProductId) {
    return res.status(400).json({message: 'Product id is required'})
  }
  
  try {
    const comments = await Comment.findAll({
      where: {
        ...(farmerProductId ? {farmerProductId} : {}),
        ...(processorProductId ? {processorProductId} : {})
      },
      include: [
        {
          model: User,
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
    
    res.status(200).json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({message: 'Internal server error'})
  }
})

export default router