const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Patient = new Schema({
    full_name:String,
    birth_date: String,
    phone:String,
    gender:String,
    code:String,
    age:Number,
    history:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'History'
        }
    ]
})

module.exports = mongoose.model('Patient', Patient);