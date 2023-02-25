const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const errorController = require('./controllers/error');
const Expense = require('./models/expenseModel');
const User = require('./models/userModel');

const app = express();

const mainRoutes = require('./routes/expenseRoute');
const userRoutes = require('./routes/userRoute');
const orderRoutes = require('./routes/orderRoute');
const Order = require('./models/orderModel');

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/expense', mainRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);

app.use(errorController.get404);

Expense.belongsTo(User);
User.hasMany(Expense);

User.hasMany(Order);
Order.belongsTo(User);
sequelize.sync().then(res=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})


