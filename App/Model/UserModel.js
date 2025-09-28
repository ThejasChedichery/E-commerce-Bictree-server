const mongoose = require('mongoose')

// User schema
const UserSchema = new mongoose.Schema({
    userName : {type:String,required:true},
    email : {type:String,required:true, unique:true},
    password:{type:String,required:true},
    role:{type:String,require:true,
        enum:["user","admin"],
        default:"user"
    }
},{timestamps:true})

const UserData = mongoose.model('users',UserSchema);
module.exports = UserData;