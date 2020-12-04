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

app.use(express.static("static"));

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.listen(8080);