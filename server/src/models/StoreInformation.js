import {Sequelize} from 'sequelize'
import db from '../dbConfig.js'

const StoreInformation = db.define('StoreInformation', {
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
    },
    operatorName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    weight: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    storageTemperature: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    storageCondition: {
        type: Sequelize.STRING,
        allowNull: true
    },
    otherStorageDetails: {
        type: Sequelize.STRING,
        allowNull: true
    },
    notes: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    tableName: 'store_information',
    timestamps: true
})

export default StoreInformation