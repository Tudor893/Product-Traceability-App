import {Sequelize} from 'sequelize'
import db from '../dbConfig.js'

const FarmerProduct = db.define('FarmerProduct', {
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
    category: {
        type: Sequelize.STRING,
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
    batch: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cost: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    harvestDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    location: {
        type: Sequelize.STRING,
        allowNull: false
    },
    bio: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    tableName: 'farmer_products',
    timestamps: true
})

export default FarmerProduct