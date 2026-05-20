const {userModel}=require('../models/user.model')
const bcrypt=require('bcrypt')
const tokengenerator = require('../middleware/Auth');

const UserRegister=async(req,res)=>{
try{
    const userdata=req.body
    const existuser=await userModel.findOne({email:userdata.email})
    if(existuser){
        return res.status(400).send({message:"user already register"})
    }
    const hashedpassword=await bcrypt.hash(userdata.password,10)   
    const newUser = new userModel({
      ...userdata,
      password: hashedpassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered" });
}
catch(err){
 return res.status(500).send({message:"register failed"})
}
}
const UserLogin=async(req,res)=>{
    try{
        const {email,password}=req.body
        const existuser=await userModel.findOne({email:userdata.email})
    if(!existuser){
        return res.status(400).send({message:"user not register"})
    }
    const matchedpassword=await bcrypt.compare(password,userdata.password) 
    if(!matchedpassword){
        return res.status(400).send({message:"invalid password"})
    }
const token = tokengenerator(existData._id);
     return res.status(200).json({
      message: "User login successfully",
      data: {
        token,
        user: {
          id: existData._id,
          userId: existData.userId,
          username: existData.username,
          email: existData.email
        }
      }
    });
    }
    catch(err){
 return res.status(500).send({message:"login failed"})
}
}
module.exports={UserRegister,UserLogin}