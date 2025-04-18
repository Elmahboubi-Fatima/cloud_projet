const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    _id: String,
    name: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    role: {type: String, enum: ["admin", "member", "guest"], default: "guest" }
  })

module.exports = mongoose.model('User',UserSchema)