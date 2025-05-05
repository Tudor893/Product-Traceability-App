import {Sequelize} from 'sequelize'
import db from '../dbConfig.js'

const CompanyInformation = db.define('CompanyInformation', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uic: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    county: {
        type: Sequelize.STRING,
        allowNull: false
    },
    country: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    tableName: 'company_information',
    timestamps: true
})

export default CompanyInformation