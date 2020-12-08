var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tempUserSchema = new Schema ({
    email : String,
    // created_at : Date,
    topic : String,
    random_token : String,
    is_used : Boolean,
    is_expired : Boolean,
    role : Number,
})
tempUserSchema.set('timestamps',true);
module.exports = mongoose.model('tempUser', tempUserSchema, 'temp_user'); 
