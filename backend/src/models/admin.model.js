const mongoose=require('mongoose')
const adminSchema=new mongoose.Schema({
    username:{type:String},
    email:{type:String},
    password:{type:String},
    role:{type:String}
})
const adminModel=mongoose.model('admin',adminSchema)
module.exports={adminModel}