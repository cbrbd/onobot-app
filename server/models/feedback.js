const mongoose = require('mongoose');

const collectionName = 'feedback';

const GuessSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    count:{
        type:Number,
        required: true
    }
}, {_id: false})


const feedbackSchema = new mongoose.Schema({
    data:{
        guess: [GuessSchema],
        higherGuess:{
            type: String,
            required: true
        },
        higherCount:{
            type: Number,
            required: true
        },
        total:{
            type: Number,
            required: true
        },
        message:{
            type: String,
            required: true
        },
        rawData: {
            type:[Number],
            required: true
        }
    },
    predictedLabel:{
        type: String,
        required: true
    },
    trueLabel: {
        type: String
    },
    videoID:{
        type:String,
        required: true
    },
    success:{   
        type: Boolean
    }
})

module.exports = mongoose.model(collectionName, feedbackSchema);