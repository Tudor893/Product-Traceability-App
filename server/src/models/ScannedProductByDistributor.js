import {Sequelize} from 'sequelize'
import db from '../dbConfig.js'

const ScannedProductByDistributor = db.define('ScannedProductByDistributor', {
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
    farmerProductId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'farmer_products',
            key: 'id'
        }
    },
    processorProductId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'processor_products',
            key: 'id'
        }
    }
}, {
    tableName: 'scanned_products_by_distributor',
    timestamps: true
})

export default ScannedProductByDistributor