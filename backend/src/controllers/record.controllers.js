const record=require('../models/record.model')

const postrecord=async(req,res)=>{
try{
    // const recorddata=req.body
    // const saved=new record(recorddata)
    // await saved.save()
    const saved = await record.create(req.body)
    return res.status(201).send({message:"data submitted",data:saved})
}
catch(err){
 return res.status(500).send({message:"data error"})
}
}
const getrecord=async(req,res)=>{
    try{
         const showrecord=await record.find().sort({_id:-1})
         return res.status(200).send({data:showrecord})
    }
    catch(err){
        return res.status(500).send({message:"error"})
    }
}
const deleterecord = async (req, res) => {
    try {
        const { id } = req.params; 
        const deleted = await record.findByIdAndDelete(id);
        return res.status(200).send({ message: "Record deleted successfully" });
    } catch (err) {
        return res.status(500).send({ message: "Error deleting record" });
    }
};
module.exports={postrecord,getrecord,deleterecord}
