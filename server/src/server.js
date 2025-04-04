import express from 'express'
import axios from 'axios'
import cors from 'cors'
import DB_Init from './models/DB_Init.js'
import User from './models/User.js'
import authMiddleware from './authMiddleware.js'
import FarmerProduct from './models/FarmerProduct.js'
import ScannedProductByProducer from './models/ScannedProductByProducer.js'
import ScannedProductByDistributor from './models/ScannedProductByDistributor.js'
import ProducerProduct from './models/ProducerProduct.js'
import ProducerFarmerProduct from './models/ProducerFarmerProduct.js'

const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

DB_Init()

const companyRoles = {
  1: 'Producător',
  86: 'Fermier',
  94: 'Distribuitor'
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

app.post('/api/auth/google', async (req, res) => {
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

app.get('/api/auth/validate', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true })
})

app.put('/api/userDetails', authMiddleware, async (req, res) => {
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

app.get('/api/user/status', authMiddleware, async (req, res) => {
  try {
      const email = req.user.email
      const user = await User.findOne({ where: { email } })

      if (!user) {
          return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json({ role: user.role, detailsCompleted: user.detailsCompleted })
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/company/:uic', async (req, res) => {
  const uic = req.params.uic

  try {
    const companyData = await getCompanyInfo(uic)
    const companyRole = getCompanyRole(uic)
    
    if (companyData && companyData.name) {
      res.status(200).json({ companyName: companyData.name, companyRole: companyRole })
    } else {
      res.status(404).json({ error: 'Firma nu a fost găsită' })
    }
  } catch (error) {
      res.status(500).json({ error: error.message })
  }
})

app.post('/api/farmerProducts', authMiddleware, async (req, res) => {
  try {
    const {
      productName,
      category,
      quantity,
      unit,
      cost,
      harvestDate,
      location,
      description
    } = req.body

    const userEmail = req.user.email
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userId = user.id;

    if (!productName || !category || !quantity || !unit || !cost || !harvestDate || !location) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const newProduct = await FarmerProduct.create({
      userId,
      productName,
      category,
      quantity,
      unit,
      cost,
      harvestDate,
      location,
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

app.get('/api/farmerProducts', authMiddleware, async (req, res) => {
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

app.post('/api/scanned-products', authMiddleware, async (req, res) => {
  try {
    const { productId, userRole, sender } = req.body

    const userEmail = req.user.email
    const user = await User.findOne({ where: { email: userEmail } })
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost gasit' })
    }
    const userId = user.id

    if(userRole === "producator"){

      const product = await FarmerProduct.findByPk(productId)
      if (!product) {
        return res.status(404).json({ message: 'Produsul nu a fost gasit' })
      }

      const existingScan = await ScannedProductByProducer.findOne({
        where: { productId }
      })
      
      if (existingScan) {
        return res.status(400).json({ message: 'Produs deja scanat' })
      }

      const scannedProduct = await ScannedProductByProducer.create({
        userId,
        productId
      })
      
      res.status(201).json({
        message: 'Product scanned successful',
        data: scannedProduct
      });
    }else if(userRole === "distribuitor"){

      if(sender === "fermier"){

        const product = await FarmerProduct.findByPk(productId)
        if (!product) {
          return res.status(404).json({ message: 'Produsul nu a fost gasit' })
        }

        const existingScan = await ScannedProductByDistributor.findOne({
          where: { farmerProductId: productId }
        })
        
        if (existingScan) {
          return res.status(400).json({ message: 'Produs deja scanat' })
        }

        const scannedProduct = await ScannedProductByDistributor.create({
          userId,
          farmerProductId: productId,
          producerProductId: null
        })
        
        res.status(201).json({
          message: 'Product scanned successful',
          data: scannedProduct
        })
      }else if(sender === "producator"){
        const product = await ProducerProduct.findByPk(productId)
        if (!product) {
          return res.status(404).json({ message: 'Produsul nu a fost gasit' })
        }

        const existingScan = await ScannedProductByDistributor.findOne({
          where: { producerProductId: productId }
        })
        
        if (existingScan) {
          return res.status(400).json({ message: 'Produs deja scanat' })
        }

        const scannedProduct = await ScannedProductByDistributor.create({
          userId,
          farmerProductId: null,
          producerProductId: productId
        })
        
        res.status(201).json({
          message: 'Product scanned successful',
          data: scannedProduct
        });
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

    const scannedProductsByProducer = await ScannedProductByProducer.findAll({
      where: { userId: user.id },
      include: [{
        model: FarmerProduct,
        as: 'farmerProduct',
        required: false
      }],
      order: [['createdAt', 'DESC']]
    })
    res.status(200).json(scannedProductsByProducer)
  } catch (error) {
    console.error('Error fetching scanned products:', error)
    res.status(500).json({ message: 'Eroare la preluarea produselor scanate' })
  }
})

app.post('/api/producerProducts', authMiddleware, async (req, res) => {
  try {
      const { 
          productName, 
          batch, 
          quantity, 
          unit, 
          productionDate, 
          expirationDate, 
          storageConditions, 
          notes,
          selectedIngredients
      } = req.body

      const userEmail = req.user.email
      const user = await User.findOne({ where: { email: userEmail } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userId = user.id;
  
      if (!productName || !batch || !quantity || !unit || !productionDate || !expirationDate || !storageConditions || !selectedIngredients) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const producerProduct = await ProducerProduct.create({
          userId: userId,
          productName,
          batch,
          productionDate,
          expirationDate,
          quantity,
          unit,
          storageConditions,
          notes: notes || null
      })

      if (selectedIngredients && selectedIngredients.length > 0) {
          const associations = selectedIngredients.map(ingredient => {
              const farmerProductId = ingredient.farmerProduct.id

              return {
                  producerProductId: producerProduct.id,
                  farmerProductId: farmerProductId
              }
          })

          await ProducerFarmerProduct.bulkCreate(associations)
      }

      return res.status(201).json({
          success: true,
          message: 'Produsul a fost adăugat cu succes!',
          product: producerProduct
      })
  } catch (error) {
      console.error('Error creating producer product:', error)
      return res.status(500).json({
          success: false,
          message: 'A apărut o eroare la adăugarea produsului.',
          error: error.message
      })
  }
})

app.get('/api/producerProducts', authMiddleware, async (req, res) => {
  try {
      const userEmail = req.user.email
      const user = await User.findOne({ where: { email: userEmail } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      const userId = user.id

      const products = await ProducerProduct.findAll({
          where: { userId: userId },
          order: [['createdAt', 'DESC']]
      })

      return res.status(200).json(products)
  } catch (error) {
      console.error('Error fetching producer products:', error)
      return res.status(500).json({
          success: false,
          message: 'A apărut o eroare la obținerea produselor.',
          error: error.message
      })
  }
})

app.listen(port, () => {
  console.log(`Serverul rulează pe http://localhost:${port}`)
})