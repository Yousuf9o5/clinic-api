const mongoose = require('mongoose');
const Schema = mongoose.Schema

const User = new Schema({
    username:{
        type:String,
        unique:true
    },
    password: String,
    roles:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Role'
        }
    ]
})

module.exports = mongoose.model('User', User);