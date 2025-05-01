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
import ProcessorFarmerProduct from './models/ProcessorFarmerProduct.js'
import DistributorInformation from './models/DistributorInformation.js'
import ScannedProductByStore from './models/ScannedProductByStore.js'

const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

DB_Init()

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
      batch,
      weight,
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

    if (!productName || !category || !quantity || !unit || !cost || !batch || !weight || !harvestDate || !location) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const newProduct = await FarmerProduct.create({
      userId,
      productName,
      category,
      quantity,
      unit,
      batch,
      weight,
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
    }else if(userRole === "distribuitor" || userRole === 'magazin'){

      if(sender === "fermier"){

        const product = await FarmerProduct.findByPk(productId)
        if (!product) {
          return res.status(404).json({ message: 'Produsul nu a fost gasit' })
        }

        let existingScan;
        if(userRole === 'distribuitor'){ 
          existingScan = await ScannedProductByDistributor.findOne({
            where: { farmerProductId: productId }
        })}else if(userRole === 'magazin'){
            existingScan = await ScannedProductByStore.findOne({
              where: { farmerProductId: productId }
          })
        }
        
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
          })
        }
        
        res.status(201).json({
          message: 'Product scanned successful',
          data: scannedProduct
        })
      }else if(sender === "procesator"){
        const product = await ProcessorProduct.findByPk(productId)
        if (!product) {
          return res.status(404).json({ message: 'Produsul nu a fost gasit' })
        }

        let existingScan;
        if(userRole === 'distribuitor'){ 
          existingScan = await ScannedProductByDistributor.findOne({
            where: { farmerProductId: productId }
        })}else if(userRole === 'magazin'){
            existingScan = await ScannedProductByStore.findOne({
              where: { farmerProductId: productId }
          })
        }
        
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
          })
        }
        
        res.status(201).json({
          message: 'Product scanned successful',
          data: scannedProduct
        });
      }
    }else if(userRole === 'client'){
      
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

app.post('/api/processorProducts', authMiddleware, async (req, res) => {
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

      const processorProduct = await ProcessorProduct.create({
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

app.get('/api/processorProducts', authMiddleware, async (req, res) => {
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

app.post('/api/distributorInformation', authMiddleware, async (req, res) => {
  try {
      const { 
          quantity, 
          weight, 
          notes,
          wasStored,
          storageTemperature, 
          storageDuration, 
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

        if (!quantity || !weight) {
            return res.status(400).json({
                success: false,
                message: 'Cantitatea si greutatea sunt obligatorii'
            })
        }

        if (wasStored) {
            if (!storageTemperature || !storageDuration || !storageCondition) {
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
        }

        const distributorInfo = await DistributorInformation.create({
            userId,
            farmerProductId,
            processorProductId,
            quantity,
            weight,
            wasStored,
            storageTemperature: wasStored ? storageTemperature : null,
            storageDuration: wasStored ? storageDuration : null,
            storageCondition: wasStored ? storageCondition : null,
            otherStorageDetails: wasStored && storageCondition === 'other' ? otherStorageDetails : null,
            notes
        })

        return res.status(201).json({
            success: true,
            message: 'Informatiile despre produs au fost salvate cu succes',
            distributorInfo
        })
    } catch (error) {
        console.error('Error creating distributor information:', error)
        return res.status(500).json({
            success: false,
            message: 'A aparut o eroare la salvarea informatiilor',
            error: error.message
        })
    }
})

app.get('/api/distributorInformation', authMiddleware, async (req, res) => {
  try {
      const userEmail = req.user.email
      const user = await User.findOne({ where: { email: userEmail } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      const userId = user.id
      
      const distributorInfo = await DistributorInformation.findAll({
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

      return res.status(200).json(distributorInfo)
  } catch (error) {
      console.error('Error fetching distributor information:', error)
      return res.status(500).json({
          success: false,
          message: 'A aparut o eroare la preluarea informatiilor',
          error: error.message
      })
  }
})

app.listen(port, () => {
  console.log(`Serverul rulează pe http://localhost:${port}`)
})