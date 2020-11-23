const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');

// Store hash in your password DB.

// Load hash from your password DB.
// bcrypt.compareSync("B4c0/\/", hash); // true
// bcrypt.compareSync("not_bacon", hash); // false

const user = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    userType: Number
})

user.methods.hash = function () {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;

}

user.methods.compare = function (pass, hash) {
    return bcrypt.compareSync(pass, hash); // true
    //bcrypt.compareSync("not_bacon", hash); // false
}

var User = mongoose.model('User', user)

module.exports = User;