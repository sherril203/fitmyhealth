const mongoose=require('mongoose')
const recordSchema=new mongoose.Schema({
    title:{type:String},
    no_of_columns:{type:Number},
    column_name:{type:[String]}
})
const RecordModel=mongoose.model('records',recordSchema)
module.exports=RecordModel