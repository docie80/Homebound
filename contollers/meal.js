const router =require("express").Router()
const data = require('./../data')


router.get("/", (req, res) => {

    console.log("Routed >>>>>>>>>>.")

    data.getAllPack().then((data) => {
        console.log("Fetched meals ", data)
        res.render("meals", { data: data });
    }).catch((err) => {
        res.render("meals");
    });
});



router.get("/:id", (req, res) => {

    const id  = req.params.id
    data.getMeal(id).then((data) => {
        console.log("Fetched meals ", data)
        res.render("mealDetail", { data: data });
    }).catch((err) => {
        res.render("mealDetail");
    });
});
module.exports = router
