var nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('./models/user');
const Meal = require('./models/meal');
const Cart = require('./models/shoppingCart')
const transporter = require('nodemailer').transporter;


//setup this transporter with your email options
//uncomment below to implement mail functions
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'youremail@gmail.com',
//     pass: 'yourpassword'
//   }
// });

mongoose.connect('mongodb+srv://mahloola:Apple123@cluster0.2trx1.mongodb.net/WEB322', { useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', function (err) {
    console.error(err)
})
db.on('open', function () {
    console.log("Connected successfully")
})


// //= [{
//     name: "Mexican",
//     numMealsInPackage: 0,
//     topMeal: true,
//     img: "mex.jpg",
//     meals: [{ name: "Tacos" }, { name: "Fajitas" }]
// },


module.exports.getAllPack = () => {

    return new Promise((resolve, reject) => {
        Meal.find().lean().then( (mealPacks) =>{

            if (mealPacks.length == 0) {
                reject({ message: "Sorry there are no meals available" });
            }
            else
                resolve(mealPacks);

        })
    });
};


module.exports.getAllMeal = () => {
    return new Promise((resolve, reject) => {
        
        Meal.find({}, (err, meals) =>{
            if (meals.length == 0) {
                reject({ message: "Sorry there are no meals available" });
            }
            else
                resolve(meals);

        })
      
    });
};

module.exports.getMeal = (id) => {
    return new Promise((resolve, reject) => {
        
        Meal.findOne({_id: id}).lean().then( meals =>{
            if (meals === undefined || meals === null) {
                reject({ message: "Sorry there are no meals available" });
            }
            else
                resolve(meals);

        })
      
    });
};

module.exports.getMealByName = (mealName) => {
    return new Promise((resolve, reject) => {
        var filteredMeal = meal.filter(x => x.name == mealName);
        if (filteredMeal.length == 0) {
            reject({ message: "Sorry there are no meals by that name" });
        }
        else
            resolve(filteredMeal);
    });
};



module.exports.createMeal = (meal) => {
    return new Promise((resolve, reject) => {

       // meal.img = meal.file
        meal.top = meal.top ==='on' ? true : false
        const mealModel = new Meal(meal)
        console.log("THE PASSED MEAL ", meal)
        mealModel.save((err, meal)=>{
            if(err){
                 reject(err)
            }else{
                resolve(meal)
            }     
        })  
    });
};



module.exports.deleteMeal = (id) => {
    return new Promise((resolve, reject) => {

        
        Meal.remove({_id: id}, (err, meal)=>{
            if(err){
                 reject(err)
            }else{
                resolve(meal)
            }     
        })  
    });
};


module.exports.editMeal = (meal) => {
    return new Promise((resolve, reject) => {

        
        Meal.save(meal, (err, meal)=>{
            if(err){
                 reject(err)
            }else{
                resolve(meal)
            }     
        })  
    });
};



module.exports.validateLogin = (data) => {
    return new Promise((resolve, reject) => {
        validateEmailPass(data).then(() => {

            User.findOne({ email: data.email }, function (err, user) {
                console.log("FInd USER: ", user)
                if (user === null) {
                    data.message("Invalid username or password")
                    console.log("Invalid user ")
                    return reject(data)
                }

                console.log(data.password, " user hash ", user.password)
                if (new User(data).compare(data.password, user.password) === true) {
                    return resolve(user);
                } else {
                    console.log('invalid password ')
                    data.message("Invalid username or password")
                    return reject(data)
                }
            })

        }).catch((data) => {
            console.log(data)
            return reject(data);
        });

    });
}

// TODO: about creating shoping cart api to add to cart


module.exports.validateRegister = (data) => {
    return new Promise((resolve, reject) => {
        validateEmailPass(data).then(() => {
            if (data.fname && data.lname && data.fname != "" && data.lname != "") {
                if (data.password == data.password1) {

                    console.log("Correct Register");



                    data.firstName = data.fname
                    data.lastName = data.lname
                    data.userType = 0
                    const user = new User(data)
                    user.hash();


                    user.save(function (err, user) {
                        console.log(user)
                        if (err) {
                            data.message = err
                            return reject(data)
                        }
                        /*
                        var mailOptions = {
                            from: 'mahloola08@gmail.com',
                            to: `${data.email}`,
                            subject: 'Registering with the site',
                            text: 'Thank you for registering with Happy Food!'
                          };

                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                              console.log('Email sent: ' + info.response);
                            }
                          });
                        */
                        resolve(user);
                    });
                    // User.save(user, )


                }
                else {
                    data.message = "Passwords don't match";
                    data.password = null;
                    data.password1 = null;
                    reject(data);
                }
            }
            else {
                data.message = "First name and Last name cannot be empty";
                data.fname = null;
                data.lname = null;
                reject(data);
            }
        }).catch((data) => {
            reject(data);
        });
    });
}


validateEmailPass = function (data) {
    return new Promise((resolve, reject) => {
        var flag = true;
        let emailReg = /[^@]+@[^\.]+\..+/;
        let passReg = /^[0-9a-zA-Z@#$][0-9a-zA-Z@#$][0-9a-zA-Z@#$]+$/;
        if (!data.email || data.email == "") {
            flag = false;
            data.email = null;
            data.message = "Incorrect Email";
        }
        else if (!data.password || data.password == "") {
            flag = false;
            data.password = null;
            data.message = "Incorrect Password";
        }
        else if (!passReg.test(data.password)) {
            flag = false;
            data.password = null;
            data.message = "Password should be alpha numeric or !@#$";
        }
        else if (!emailReg.test(data.email)) {
            flag = false;
            data.email = null;
            data.message = "Incorrect email format";
        }
        if (flag) {
            resolve();
        }
        else {
            reject(data);
        }
    });
}



//Current static food data
var meal = [{
    img: "/spag.jpg",
    name: "Spaghetti",
    servings: 2,
    price: 10.99
}, {
    img: "/hamb.jpg",
    name: "Hamburger",
    servings: 1,
    price: 5.99
}, {
    img: "/raman.jpg",
    name: "Raman",
    servings: 2,
    price: 10.99
}, {
    img: "/sandwich.jpg",
    name: "Sandwich",
    servings: 3,
    price: 7.99
}, {
    img: "/sushi.jpg",
    name: "Sushi",
    servings: 4,
    price: 20.99
}, {
    img: "/fSalad.jpg",
    name: "Fruit Salad",
    servings: 3,
    price: 15.99
}, {
    img: "/cSalad.jpg",
    name: "Ceaser Salad",
    servings: 1,
    price: 8.99
}, {
    img: "/tacos.jpg",
    name: "Tacos",
    servings: 6,
    price: 20.99
}, {
    img: "/fajitas.jpg",
    name: "Fajitas",
    servings: 5,
    price: 7.99
}
];

var mealPackage = [{
    name: "Mexican",
    numMealsInPackage: 0,
    topMeal: true,
    img: "mex.jpg",
    meals: [{ name: "Tacos" }, { name: "Fajitas" }]
}, {
    name: "vegetarian",
    numMealsInPackage: 2,
    topMeal: true,
    img: "veg.jpg",
    meals: [{ name: "Ceaser Salad" }, { name: "Fruit Salad" }]
}, {
    name: "Italian",
    numMealsInPackage: 0,
    topMeal: true,
    img: "ital.jpg",
    meals: [{ name: "Spaghetti" }, { name: "Fajitas" }]
}, {
    name: "American",
    numMealsInPackage: 2,
    topMeal: false,
    img: "Amer.jpg",
    meals: [{ name: "Hamburger" }, { name: "Sandwich" }]
}, {
    name: "Japanese",
    numMealsInPackage: 2,
    topMeal: true,
    img: "Japan.jpg",
    meals: [{ name: "Sushi" }, { name: "Raman" }]
}];