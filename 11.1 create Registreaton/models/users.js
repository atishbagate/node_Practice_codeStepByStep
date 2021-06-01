const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    _id :mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    address: String,
    password:String
},{timestamp:true})

console.log("userSchema is accepted");
const User = mongoose.model('User',UserSchema);
module.exports = User;