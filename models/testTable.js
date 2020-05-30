// creating model
const mongoose = require('mongoose')
const testTable = new mongoose.Schema({ 
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    address:String,
    password:String
})

module.exports = mongoose.model('test', testTable) // (tableName:- test + 's' that means tests . here s is given by mongoose)

