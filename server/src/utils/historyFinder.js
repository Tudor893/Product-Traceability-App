import CompanyInformation from '../models/CompanyInformation.js'
import ScannedProductByStore from '../models/ScannedProductByStore.js'
import ScannedProductByDistributor from '../models/ScannedProductByDistributor.js'
import DistributorInformation from '../models/DistributorInformation.js'
import ProcessorFarmerProduct from '../models/ProcessorFarmerProduct.js'
import StoreInformation from '../models/StoreInformation.js'
import User from '../models/User.js'
import FarmerProduct from '../models/FarmerProduct.js'
import ProcessorProduct from '../models/ProcessorProduct.js'

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

export async function farmerHistory(data, id) {
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

export async function processorHistory(data, id) {
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