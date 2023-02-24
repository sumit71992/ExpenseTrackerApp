const Sequelize = require('sequelize');

const sequelize = new Sequelize('expensetracker','root','kbicky',{
    dialect: 'mysql',
    host: 'localhost'
});
module.exports = sequelize;