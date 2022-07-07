const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback')


//returns statistics about Onobot, total count of prediction, count of good prediction and count of untagged
router.get("/stats", async function(req, res){
    try {
        const total = await Feedback.countDocuments({$or:[{success: true}, {success: false}]});
        const goodPred = await Feedback.countDocuments({success: true});
        const untagged = await Feedback.countDocuments({success: undefined})
        res.status(200).json({total: total, goodPred: goodPred, untagged: untagged})
    } catch (error) {
        res.status(500).json(error);
    }
})

//find feedback by id
router.get('/id/:id', async function(req, res){
    try{
        const feedback = await Feedback.findById(req.params.id);
        res.status(200).json(feedback);
    } catch(error){
        res.status(500).json(error);
    }
})


//find feedback by youtube id
router.get('/videoid/:videoid', async function(req, res){
    try{
        const feedback = await Feedback.findOne({videoID: req.params.videoid});
        res.status(200).json(feedback);
    } catch(error){
        res.status(500).json(error);
    }
})


//find feedback with page number and batchsize
router.get('/',  async (req, res) =>{
    try {
        const feedbacks = await Feedback.find().sort({ _id: -1 }).skip(req.query.page*req.query.batchSize).limit(req.query.batchSize);
        res.status(200).json(feedbacks)
    } catch (error) {
        res.status(500).json(error)
    }
})


//create new feedbacks
router.post('/', function(req, res){
    try {
        const {data, predictedLabel, trueLabel, success, videoID} = req.body;
        const newFeedback = new Feedback({data: data, predictedLabel:predictedLabel, trueLabel: trueLabel, videoID: videoID, success: success})
    
        newFeedback.save(function(err){
            if(err) {
                console.log("error", err)
                res.status(500).send("An error occured while saving this feedback");
            } else {
                res.status(200).send(newFeedback._id);
                console.log("id:", newFeedback._id)
            }
        })
        
    } catch (error) {
        res.status(500)
    }
})

//edit feedback with id
router.post("/id/:id", async function(req, res){
    const {trueLabel, success} = req.body;
    console.log(req.params.id, trueLabel, success);
    try{
        let dings = await Feedback.findOneAndUpdate({_id: req.params.id}, {trueLabel: trueLabel, success: success});
        console.log(dings);
        res.status(200);
    } catch(error){
        console.log("error", error)
        res.status(500).json(error);
    }
})

module.exports = router;
