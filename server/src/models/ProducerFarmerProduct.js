import { Sequelize } from 'sequelize'
import db from '../dbConfig.js'
import ProducerProduct from './ProducerProduct.js'
import FarmerProduct from './FarmerProduct.js'

const ProducerFarmerProduct = db.define('ProducerFarmerProduct', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    producerProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: ProducerProduct,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    farmerProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: FarmerProduct,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'producer_farmer_products',
    timestamps: false
})

export default ProducerFarmerProduct
