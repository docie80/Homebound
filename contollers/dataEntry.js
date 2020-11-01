const router = require('express').Router();
const data = require("../data");

const fs = require('fs')
//const session = require('express-session')

router.get("/", (req, res) => {
    if (req.session.user) {
        if (req.session.user.userType === 1)
            res.render("dataEntryDashboard");
        else
            res.redirect('/dashboard')
    } else {
        res.redirect('/login')
    }
});


var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

 // var upload = multer({ dest: './public/data/uploads/' })

 var multer  = require('multer')

 var storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, './public/data/uploads/')
     },
     filename: function (req, file, cb) {
 
         const ext = file.originalname.substr(file.originalname.lastIndexOf('.'))
       cb(null, file.fieldname + '-' + Date.now()+ ext)
     }
   })
 
  // var upload = multer({ dest: './public/data/uploads/' })
  var upload = multer({ storage: storage })
 
 router.post('/', upload.single('file'), function (req, res) {
 
 
    req.body.img = req.file.filename
     data.createMeal(req.body).then(function (meal) {
         res.redirect("/meals");
     }).catch(function(err) {
         
     })
 
     //console.log(req.file, req.body)
 })

// router.post("/",(req,res)=>{



//     data.validateLogin(req.body).then((user)=>{
//         delete user.password
//         req.session.user = user
//         //res.render("dashboard",{data: req.body});
//         res.redirect("dashboard");
//     }).catch((data)=>{
//         res.render("login",{data:data});
//     });
// });

module.exports = router
