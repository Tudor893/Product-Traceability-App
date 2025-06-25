import express from 'express'
import cors from 'cors'
import DB_Init from './models/DB_Init.js'
import userRoutes from './routes/user.js'
import farmerRoutes from './routes/farmer.js'
import processorRoutes from './routes/processor.js'
import authRoutes from './routes/auth.js'
import distributorRoutes from './routes/distributor.js'
import storeRoutes from './routes/store.js'
import clientRoutes from './routes/client.js'
import companyRoutes from './routes/company.js'
import scannedProducts from './routes/scannedProducts.js'
import unknownUser from './routes/unknownUser.js'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

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
app.use('/api/company', companyRoutes)
app.use('/api/scanned-products', scannedProducts)
app.use('/api/unknown-user', unknownUser)

async function chatWithGPT(message) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Ești un asistent virtual pentru o aplicație de trasabilitate numita TraceLink. 
          În această aplicație, utilizatorii pot intra fie ca firmă, fie ca și consumator. 
          O firmă se identifică prin introducerea unui CUI (cod unic de identificare), 
          iar apoi poate asocia și gestiona produse. 
          Consumatorii pot scana coduri QR de pe produse pentru a vedea informații detaliate despre acestea, 
          inclusiv traseul lor, producătorul, procesatorul, distribuitorul și magazinul. 
          Răspunde la întrebări despre funcționalitățile aplicației, trasabilitate, 
          rolurile utilizatorilor și modul de utilizare al codurilor QR.`
        },
        { role: 'user', content: message }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OpenAI_apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  )
  return response.data.choices[0].message.content
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: 'Mesajul este necesar.' })
    }
    const raspuns = await chatWithGPT(message)
    res.json({ response: raspuns })
  } catch (err) {
    res.status(500).json({ error: 'Eroare la comunicarea cu OpenAI.' })
  }
})

app.listen(port, async () => {
  console.log(`Serverul rulează pe http://localhost:${port}`)
})