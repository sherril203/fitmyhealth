const mongoose=require('mongoose')
const feedbackSchema=new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    message:{type:String}
})
const feedbackModel=mongoose.model('feed',feedbackSchema)
module.exports=feedbackModel
