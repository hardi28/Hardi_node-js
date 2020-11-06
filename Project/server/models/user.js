var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const userSchema = new Schema({
    email: String,
    password: String,
    role_id: Object,
});
// console.log(userSchema);

module.exports = mongoose.model('user', userSchema, 'users');

 /* var mongoose = require('mongoose');
var Schema = mongoose.Schema;*/

// var roleSchema = new Schema({
//     // email: String,
//     // password: String,
//     role_id :[{type: Schema.Types.ObjectId, ref: 'role_user'}]
// });
// // console.log('----------');
// // console.log(roleSchema);
// // if (roleSchema == 2){
// //     console.log("hey employee")
// // }
// module.exports = mongoose.model('role', roleSchema, 'role_user'); 
