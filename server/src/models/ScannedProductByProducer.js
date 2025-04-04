import {Sequelize} from 'sequelize'
import db from '../dbConfig.js'

const ScannedProductByProducer = db.define('ScannedProductByProducer', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'farmer_products',
            key: 'id'
        }
    }
}, {
    tableName: 'scanned_products_by_producer',
    timestamps: true
})

export default ScannedProductByProducer