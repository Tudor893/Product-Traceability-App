import express from 'express'
import { farmerHistory, processorHistory } from '../utils/historyFinder.js'

const router = express.Router()

router.get('/product-history/:sender?/:id?', async (req, res) => {
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
    if(sender === 'fermier'){
      data = await farmerHistory(data, id)
      }else if(sender === 'procesator'){
        data = await processorHistory(data, id)
      }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching last record:', error)
    res.status(500).json({message: 'Internal server error'})
  }
})

export default router