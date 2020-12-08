var mongoose = require('mongoose');
// const { options } = require('../routes/api');
var Schema = mongoose.Schema;
const leaveSchema = new Schema({
    leaveReason : String,
    leaveType : RadioNodeList,
    dateRange : Date,

});
// console.log(userSchema);

module.exports = mongoose.model('leave', leaveSchema, 'emp_leave');