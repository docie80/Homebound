const express = require ('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require("path");
const bodyParser = require('body-parser');
const data = require("./data.js");
const registerCtrl = require('./contollers/registration');
const loginCtrl = require('./contollers/login');
const admin = require('./contollers/admin');

app.engine('.hbs', exphbs({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        }
    }
}));

app.set('view engine', '.hbs');

app.get('/', (req, res, next) => {
    res.render('home.hbs');
});

app.get('/login', (req, res, next) => {
    res.render('login.hbs');
});

app.get('/register', (req, res, next) => {
    res.render('register.hbs');
});

app.use("/login", loginCtrl);

app.use("/register", registerCtrl);

app.listen(8080);