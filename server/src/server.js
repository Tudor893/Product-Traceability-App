import express from 'express'
import axios from 'axios'
import cors from 'cors'
import DB_Init from './models/DB_Init.js'
import User from './models/User.js'
import authMiddleware from './authMiddleware.js'
import FarmerProduct from './models/FarmerProduct.js'
import ScannedProductByProcessor from './models/ScannedProductByProcessor.js'
import ScannedProductByDistributor from './models/ScannedProductByDistributor.js'
import ProcessorProduct from './models/ProcessorProduct.js'
import ScannedProductByStore from './models/ScannedProductByStore.js'
import ScannedProductByClient from './models/ScannedProductByClient.js'
import CompanyInformation from './models/CompanyInformation.js'
import userRoutes from './routes/user.js'
import farmerRoutes from './routes/farmer.js'
import processorRoutes from './routes/processor.js'
import authRoutes from './routes/auth.js'
import distributorRoutes from './routes/distributor.js'
import storeRoutes from './routes/store.js'
import clientRoutes from './routes/client.js'

const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

DB_Init()

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/farmer', farmerRoutes)
app.use('/api/processor', processorRoutes)
app.use('/api/distributor', distributorRoutes)
app.use('/api/store', storeRoutes)
app.use('/api/client', clientRoutes)

const companyRoles = {
  1: 'Procesator',
  86: 'Fermier',
  94: 'Distribuitor',
  15780419: 'Fermier',
  40890617: 'Procesator',
  13603950: 'Distribuitor',
  22891860: 'Magazin'
}

function getCompanyRole(uic) {
  return companyRoles[uic] || "necunoscut"
}

async function getCompanyInfo(uic) {
  try {
    const response = await axios.get(`http://lista-firme.info/api/v1/info?cui=${uic}`)
    
    if (response.status !== 200) {
      throw new Error(`Eroare la server: ${response.status}`)
    }

    return response.data
  } catch (error) {
    throw new Error(`Eroare la apelul API: ${error.message}`)
  }
}

app.get('/api/company/:uic', async (req, res) => {
  const uic = req.params.uic

  try {
    const companyData = await getCompanyInfo(uic)
    const companyRole = getCompanyRole(uic)

    if (companyData && companyData.name) {
      await CompanyInformation.create({
        uic: companyData.cui,
        name: companyData.name,
        county: companyData.address.county,
        country: companyData.address.country
      })
    }
    
    if (companyData && companyData.name) {
      res.status(200).json({ companyName: companyData.name, companyRole: companyRole })
    } else {
      res.status(404).json({ error: 'Firma nu a fost găsită' })
    }
  } catch (error) {
      res.status(500).json({ error: error.message })
  }
})

app.post('/api/scanned-products', authMiddleware, async (req, res) => {
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

app.get('/api/scanned-products', authMiddleware, async (req, res) => {
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


app.get('/api/product-history/:sender?/:id?', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Serverul rulează pe http://localhost:${port}`)
})