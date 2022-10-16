const config = require('../config/db.config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.roles = require('./role.model')(sequelize, Sequelize); // DB SET?
db.users = require('./user.model')(sequelize, Sequelize); // DB SET?

db.roles.belongsToMany(db.users, {
    through: 'user_roles',
    foreignKey: 'roleId',
    otherKey: 'userId'
});

db.users.belongsTo(db.roles, {
    through: 'user_roles',
    foreignKey: 'userId',
    otherKey: 'roleId'
});

db.ROLES = ['user', 'admin'];

module.exports = db;
