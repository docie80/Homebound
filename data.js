var nodemailer = require('nodemailer');
const mongoose = require('mongoose');
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

module.exports.validateLogin = (data) => {
    return new Promise((resolve, reject) => {
        validateEmailPass(data).then(() => {

            User.findOne({ email: data.email }, function (err, user) {
                console.log("Find user:", user)
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
                            text: 'Thank you for registering with Homebound!'
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