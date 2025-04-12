import dotenv from 'dotenv'
import pg from 'pg'
import db from '../dbConfig.js'
import User from './User.js'
import FarmerProduct from './FarmerProduct.js'
import ScannedProductByProducer from './ScannedProductByProducer.js'
import ProducerProduct from './ProducerProduct.js'
import ProducerFarmerProduct from './ProducerFarmerProduct.js'
import ScannedProductByDistributor from './ScannedProductByDistributor.js'

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

    User.hasMany(ScannedProductByProducer, {foreignKey: 'userId', onDelete: 'CASCADE'})
    ScannedProductByProducer.belongsTo(User, {foreignKey: 'userId'})

    User.hasMany(ProducerProduct, {foreignKey: 'userId', onDelete: 'CASCADE'})
    ProducerProduct.belongsTo(User, {foreignKey: 'userId'})

    User.hasMany(ScannedProductByDistributor, {foreignKey: 'userId', onDelete: 'CASCADE'})
    ScannedProductByDistributor.belongsTo(User, {foreignKey: 'userId'})
    
    FarmerProduct.hasOne(ScannedProductByProducer, {foreignKey: 'productId', as: 'scannedProduct'})
    ScannedProductByProducer.belongsTo(FarmerProduct, {foreignKey: 'productId', as: 'farmerProduct'})

    ProducerProduct.belongsToMany(FarmerProduct, { through: ProducerFarmerProduct, foreignKey: 'producerProductId' })
    FarmerProduct.belongsToMany(ProducerProduct, { through: ProducerFarmerProduct, foreignKey: 'farmerProductId' })

    ScannedProductByDistributor.belongsTo(FarmerProduct, {foreignKey: 'farmerProductId', as: 'farmerProduct'})
    ScannedProductByDistributor.belongsTo(ProducerProduct, {foreignKey: 'producerProductId', as: 'producerProduct'})
    FarmerProduct.hasMany(ScannedProductByDistributor, {foreignKey: 'farmerProductId', as: 'scannedByDistributor'})
    ProducerProduct.hasMany(ScannedProductByDistributor, {foreignKey: 'producerProductId', as: 'scannedByDistributor'})
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