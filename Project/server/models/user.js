var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const userSchema = new Schema({
    email: String,
    password: String,
    role_id: Object,
    random_token:String
});
// console.log(userSchema);

exports.user = mongoose.model('user', userSchema, 'users');

var roleSchema = new Schema({
    // email: String,
    // password: String,
    // role_id :[{type: Schema.Types.ObjectId, ref: 'role_user'}]
    role_id: Schema.Types.ObjectId
});

exports.role = mongoose.model('role', roleSchema, 'role_user'); 
