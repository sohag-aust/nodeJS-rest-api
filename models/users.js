// creating model
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({ // inside schema i should set the object 
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    address:String
})

module.exports = mongoose.model('users', userSchema) // (tableName, userSchema which is in top)

