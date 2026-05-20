const express = require('express');
const router = express.Router();
const feedback=require('../controllers/feed.controllers')
const record=require('../controllers/record.controllers')
const data=require('../controllers/data.controllers')
const user=require('../controllers/user.controllers')
const admin=require('../controllers/admin.controllers')

//user authentication
router.post('/userRegister',user.UserRegister)
router.post('/userlogin',user.UserLogin)

//admin authentication
router.post('/adminRegister',admin.AdminRegister)
router.post('/adminlogin',admin.AdminLogin)

//feedback
router.post('/feedpost',feedback.postfeed)
router.get('/getfeed',feedback.getfeed)

//CRUD in records by user
router.post('/postrecord',record.postrecord)
router.get('/getrecord',record.getrecord)
router.delete('/deleterecord/:id', record.deleterecord);
router.get('/getrecord/:id', record.getsinglerecord)

//CRUD in data to enter in record by user
router.post("/postdata/:id",data.postdata)
router.get("/getdata/:id",data.getdata)
router.get("/getsingledata/:id",data.getsingledata)
router.put("/updatedata/:id",data.updatedata)
router.delete("/deletedata/:id",data.deletedata)


module.exports=router