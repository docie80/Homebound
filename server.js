const express = require ('express');
const exphbs = require('express-handlebars');
const path = require("path");
const data = require("./data.js");
const bodyParser = require('body-parser');
const app = express();
const registerCtrl = require('./contollers/registration');
const loginCtrl = require('./contollers/login');
const dataEntryCtrl = require('./contollers/dataEntry')
const mealCtrl = require('./contollers/meal')

app.use((req, res, next) => {
    console.log(req);
    next();
});

app.get('/', (req, res, next) => {
    res.send('Welcome to Homebound!')
    res.render("home.hbs");
});

app.get('/rooms', (req, res, next) => {
    res.send('Welcome to the room listing!')
});

app.get('/register', (req, res, next) => {
    res.send('Welcome to the user registration!')
});

app.use('/meals', mealCtrl)

app.use("/login", loginCtrl)

app.use("/register", registerCtrl);


app.listen(8080);