import dotenv from 'dotenv'
import pg from 'pg'
import db from '../dbConfig.js'
import User from './User.js'
import FarmerProduct from './FarmerProduct.js'
import ScannedProductByProcessor from './ScannedProductByProcessor.js'
import ProcessorProduct from './ProcessorProduct.js'
import ProcessorFarmerProduct from './ProcessorFarmerProduct.js'
import ScannedProductByDistributor from './ScannedProductByDistributor.js'
import DistributorInformation from './DistributorInformation.js'
import ScannedProductByStore from './ScannedProductByStore.js'
import StoreInformation from './StoreInformation.js'
import ScannedProductByClient from './ScannedProductByClient.js'

const {Client} = pg
dotenv.config()

async function createDB() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })
    await client.connect()

    const result = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [process.env.DB_NAME]
    );

    if (result.rowCount === 0) {
        console.log(`${process.env.DB_NAME} database not found, creating it.`)
        await client.query(`CREATE DATABASE "${process.env.DB_NAME}";`)
        console.log(`created database ${process.env.DB_NAME}`)
    } else {
        console.log(`${process.env.DB_NAME} database exists.`)
    }

    await client.end()
}

function FK_Config(){
    User.hasMany(FarmerProduct, {foreignKey: 'userId', onDelete: 'CASCADE'})
    FarmerProduct.belongsTo(User, {foreignKey: 'userId'})

    User.hasMany(ScannedProductByProcessor, {foreignKey: 'userId', onDelete: 'CASCADE'})
    ScannedProductByProcessor.belongsTo(User, {foreignKey: 'userId'})

    User.hasMany(ProcessorProduct, {foreignKey: 'userId', onDelete: 'CASCADE'})
    ProcessorProduct.belongsTo(User, {foreignKey: 'userId'})

    User.hasMany(ScannedProductByDistributor, {foreignKey: 'userId', onDelete: 'CASCADE'})
    ScannedProductByDistributor.belongsTo(User, {foreignKey: 'userId'})

    User.hasMany(DistributorInformation, {foreignKey: 'userId', onDelete: 'CASCADE'})
    DistributorInformation.belongsTo(User, {foreignKey: 'userId'})

    User.hasMany(ScannedProductByStore, {foreignKey: 'userId', onDelete: 'CASCADE'})
    ScannedProductByStore.belongsTo(User, {foreignKey: 'userId'})
    
    User.hasMany(StoreInformation, {foreignKey: 'userId', onDelete: 'CASCADE'})
    StoreInformation.belongsTo(User, {foreignKey: 'userId'})

    User.hasMany(ScannedProductByClient, {foreignKey: 'userId', onDelete: 'CASCADE'})
    ScannedProductByClient.belongsTo(User, {foreignKey: 'userId'})
    
    FarmerProduct.hasOne(ScannedProductByProcessor, {foreignKey: 'productId', as: 'scannedProduct'})
    ScannedProductByProcessor.belongsTo(FarmerProduct, {foreignKey: 'productId', as: 'farmerProduct'})

    ProcessorProduct.belongsToMany(FarmerProduct, { through: ProcessorFarmerProduct, foreignKey: 'processorProductId' })
    FarmerProduct.belongsToMany(ProcessorProduct, { through: ProcessorFarmerProduct, foreignKey: 'farmerProductId' })

    ScannedProductByDistributor.belongsTo(FarmerProduct, {foreignKey: 'farmerProductId', as: 'farmerProduct'})
    ScannedProductByDistributor.belongsTo(ProcessorProduct, {foreignKey: 'processorProductId', as: 'processorProduct'})
    FarmerProduct.hasMany(ScannedProductByDistributor, {foreignKey: 'farmerProductId', as: 'scannedByDistributor'})
    ProcessorProduct.hasMany(ScannedProductByDistributor, {foreignKey: 'processorProductId', as: 'scannedByDistributor'})

    ScannedProductByStore.belongsTo(FarmerProduct, {foreignKey: 'farmerProductId', as: 'farmerProduct'})
    ScannedProductByStore.belongsTo(ProcessorProduct, {foreignKey: 'processorProductId', as: 'processorProduct'})
    FarmerProduct.hasMany(ScannedProductByStore, {foreignKey: 'farmerProductId', as: 'scannedByStore'})
    ProcessorProduct.hasMany(ScannedProductByStore, {foreignKey: 'processorProductId', as: 'scannedByStore'})

    ScannedProductByClient.belongsTo(FarmerProduct, {foreignKey: 'farmerProductId', as: 'farmerProduct'})
    ScannedProductByClient.belongsTo(ProcessorProduct, {foreignKey: 'processorProductId', as: 'processorProduct'})
    FarmerProduct.hasMany(ScannedProductByClient, {foreignKey: 'farmerProductId', as: 'scannedByClient'})
    ProcessorProduct.hasMany(ScannedProductByClient, {foreignKey: 'processorProductId', as: 'scannedByClient'})

    FarmerProduct.hasMany(DistributorInformation, {foreignKey: 'farmerProductId'})
    DistributorInformation.belongsTo(FarmerProduct, {foreignKey: 'farmerProductId', as: 'farmerProduct'})
    
    ProcessorProduct.hasMany(DistributorInformation, {foreignKey: 'processorProductId'})
    DistributorInformation.belongsTo(ProcessorProduct, {foreignKey: 'processorProductId', as: 'processorProduct'})
    
    FarmerProduct.hasMany(StoreInformation, {foreignKey: 'farmerProductId'})
    StoreInformation.belongsTo(FarmerProduct, {foreignKey: 'farmerProductId', as: 'farmerProduct'})
    
    ProcessorProduct.hasMany(StoreInformation, {foreignKey: 'processorProductId'})
    StoreInformation.belongsTo(ProcessorProduct, {foreignKey: 'processorProductId', as: 'processorProduct'})
}

async function DB_Init() {
    await createDB()
    
    await db.authenticate();
    console.log('Connected to database!')

    FK_Config()
    
    await db.sync({ force: false });
    console.log('Tables synchronized successfully!')
}

export default DB_Init