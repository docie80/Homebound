const router = require('express').Router();
const data = require("./../data");
//const session = require('express-session')

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res) => {

    data.validateLogin(req.body).then((user) => {
        delete user.password
        req.session.user = user
        //res.render("dashboard",{data: req.body});
        if (req.session.user.userType === 1) {
            res.redirect('/data-entry')
        } else {
            res.redirect("/dashboard");
        }
    }).catch((data) => {
        res.render("login", { data: data });
    });
});

module.exports = router
