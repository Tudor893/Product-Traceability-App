import {Sequelize} from 'sequelize'
import db from '../dbConfig.js'

const User = db.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cui: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    companyName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    role: {
        type: Sequelize.STRING,
        allowNull: true
    },
    detailsCompleted: { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timestamps: true
})

export default User