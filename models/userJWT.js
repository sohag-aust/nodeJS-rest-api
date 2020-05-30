// creating model
const mongoose = require('mongoose')
const userJWTSchema = new mongoose.Schema({ 
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    address:String,
    password:String
})

module.exports = mongoose.model('userJWT', userJWTSchema) // (tableName:- userjwt + 's' that means userjwts . here s is given by mongoose, and table name is converted to all lowercase letter)

