
const router = require('express').Router();
const data = require("./../data");

router.get("/", (req, res) => {
    res.render("register");
});

router.post("/", (req, res) => {
    data.validateRegister(req.body).then(() => {
        res.redirect("/login");
    }).catch((data) => {
        res.render("register", { data: data });
    });
});

module.exports = router
