const feedback=require('../models/feedback.model')

const postfeed=async(req,res)=>{
try{
    // const feeddata=req.body
    // const saved=new feedback(feeddata)
    // await saved.save()
    const saved = await feedback.create(req.body)
    return res.status(201).send({message:"data submitted",data:saved})
}
catch(err){
 return res.status(500).send({message:"data error"})
}
}
const getfeed=async(req,res)=>{
    try{
         const showfeed=await feedback.find().sort({_id:-1})
         return res.status(200).send({data:showfeed})
    }
    catch(err){
        return res.status(500).send({message:"error"})
    }
   

}
module.exports={postfeed,getfeed}
