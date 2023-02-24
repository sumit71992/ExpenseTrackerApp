const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const errorController = require('./controllers/error');
const Expense = require('./models/expenseModel');
const User = require('./models/userModel');

const app = express();

const mainRoutes = require('./routes/main');

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRoutes);

app.use(errorController.get404);

Expense.belongsTo(User,{constraints: true, onDelete: "CASCADE"});
User.hasMany(Expense);
sequelize.sync().then(res=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})


