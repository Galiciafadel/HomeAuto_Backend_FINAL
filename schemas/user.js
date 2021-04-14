var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// https://www.npmjs.com/package/passport-local-mongoose
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    // username: {
    //     type: String,
    //     default: '',
    //     unique:true
    // },
    // password: {
    //     type: String,
    //     default: ''
    // },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default:false
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//     username: {
//         type: String,
//         required: true,
//         unique:true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     firstname: {
//         type: String,
//         required: true
//     },
//     lastname: {
//         type: String,
//         required: true
//     },
//     isAdmin: {
//         type: Boolean,
//         default:false
//     }
// });

// let user = mongoose.model('User', UserSchema);

// module.exports = user;
