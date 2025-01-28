import mongoose from "mongoose";
//user table 
//_id
//fullname
//email
//_password
//phoneNumber 
//gender
//address

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
        maxLength:255
    },
    email:{
        type:String,
        required:true, 
        trim:true,
        maxLength:100,
        unique:true,//index:same  email cannot be repeated in this
    },
    password:{
        type:String,
        required:true,

    },
    gender:{
        type:String,
        required:true,
        trim:true,
        enum:["Male", "Female", "Others", "PreferNotToSay"]
    },
    phoneNumber:{
        type:String,
        required:true,
        maxLength:20,
        minLength:10,
    },
    address:{
        type:String,
        required: false,
        trim:true,
        maxLength:100,
    },
});

//create table/model/collection
const UserTable=mongoose.model("user", userSchema);
export default UserTable;