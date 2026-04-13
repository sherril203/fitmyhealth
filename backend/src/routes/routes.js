const express = require('express');
const router = express.Router();
const feedback=require('../controllers/feed.controllers')
const record=require('../controllers/record.controllers')
router.post('/feedpost',feedback.postfeed)
router.get('/getfeed',feedback.getfeed)

router.post('/postrecord',record.postrecord)
router.get('/getrecord',record.getrecord)
router.delete('/deleterecord/:id', record.deleterecord);
module.exports=router