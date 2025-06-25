import express from 'express'
import CompanyInformation from '../models/CompanyInformation.js'
import axios from 'axios'

const router = express.Router()

const companyRoles = {
  15780419: 'Fermier',
  40890617: 'Procesator',
  13603950: 'Distribuitor',
  22891860: 'Magazin',
  39817361: 'Fermier'
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

router.get('/:uic', async (req, res) => {
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

export default router