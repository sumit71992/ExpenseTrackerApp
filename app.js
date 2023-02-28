const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const errorController = require('./controllers/error');

const Expense = require('./models/expenseModel');
const User = require('./models/userModel');
const Order = require('./models/orderModel');
const Forgot = require('./models/forgotPasswordModel');

const app = express();

const mainRoutes = require('./routes/expenseRoute');
const userRoutes = require('./routes/userRoute');
const orderRoutes = require('./routes/orderRoute');
const passwordRoutes = require('./routes/passwordRoute');

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/expense', mainRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);
app.use('/password',passwordRoutes);

app.use(errorController.get404);

Expense.belongsTo(User);
User.hasMany(Expense);

User.hasMany(Order);
Order.belongsTo(User);

Forgot.belongsTo(User);
User.hasMany(Forgot);
sequelize.sync().then(res=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})


