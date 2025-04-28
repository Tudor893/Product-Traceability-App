import { Sequelize } from 'sequelize'
import db from '../dbConfig.js'
import ProcessorProduct from './ProcessorProduct.js'
import FarmerProduct from './FarmerProduct.js'

const ProcessorFarmerProduct = db.define('ProcessorFarmerProduct', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    processorProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: ProcessorProduct,
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
    tableName: 'processor_farmer_products',
    timestamps: false
})

export default ProcessorFarmerProduct
