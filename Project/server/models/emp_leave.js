var mongoose = require('mongoose');
// const { options } = require('../routes/api');
var Schema = mongoose.Schema;
const leaveSchema = new Schema({
    leaveReason : String,
    leaveType : String,
    startDate : Date,
    endDate : Date,
    is_approved : Boolean,
    user_id: {type: Schema.Types.ObjectId, ref: 'emp_leave'},

});
// console.log(userSchema);

module.exports = mongoose.model('leave', leaveSchema, 'emp_leave');