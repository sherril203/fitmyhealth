const {adminModel}=require('../models/admin.model')
const bcrypt=require('bcrypt')
const tokengenerator = require('../middleware/Auth');

const AdminRegister=async(req,res)=>{
try{
    const admindata=req.body
    const existAdmin=await AdminModel.findOne({email:Admindata.email})
    if(existAdmin){
        return res.status(400).send({message:"admin already register"})
    }
    const hashedpassword=await bcrypt.hash(Admindata.password,10)   
    const newAdmin = new AdminModel({
      ...admindata,
      password: hashedpassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered" });
}
catch(err){
 return res.status(500).send({message:"register failed"})
}
}
const AdminLogin=async(req,res)=>{
    try{
        const {email,password}=req.body
        const existAdmin=await AdminModel.findOne({email:Admindata.email})
    if(!existAdmin){
        return res.status(400).send({message:"Admin not register"})
    }
    const matchedpassword=await bcrypt.compare(password,Admindata.password) 
    if(!matchedpassword){
        return res.status(400).send({message:"invalid password"})
    }
const token = tokengenerator(existData._id);
     return res.status(200).json({
      message: "Admin login successfully",
      data: {
        token,
        Admin: {
          id: existData._id,
          AdminId: existData.AdminId,
          Adminname: existData.Adminname,
          email: existData.email
        }
      }
    });
    }
    catch(err){
 return res.status(500).send({message:"login failed"})
}
}
module.exports={AdminRegister,AdminLogin}