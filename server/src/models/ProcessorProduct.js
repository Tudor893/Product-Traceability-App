import {Sequelize} from 'sequelize'
import db from '../dbConfig.js'

const ProcessorProduct = db.define('ProcessorProduct', {
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
    productName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    batch: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    productionDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    expirationDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    unit: {
        type: Sequelize.STRING,
        allowNull: false
    },
    storageConditions: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    notes: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    tableName: 'processor_products',
    timestamps: true
})

export default ProcessorProduct