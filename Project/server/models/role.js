var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roleSchema = new Schema({
    // email: String,
    // password: String,
    id:Number,
    role_name: String,
    role_id :[{type: Schema.Types.ObjectId, ref: 'role_user'}],
    // role_id: Schema.Types.ObjectId
});
module.exports = mongoose.model('role', roleSchema, 'role_user'); 
