const express = require('express');
const {spawn} = require('child_process');
const router = express.Router();

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function isValidLink(url){
    if(url.includes("watch?v=") || url.includes("youtu.be/")){
        return true
    }
    return false
}   


router.get('/predict', (req, res) => {
    const url = req.query.url;
    if(!isValidLink(url)){
        res.json({"message": "This is not a valid youtube URL"})
        return
    }
    let result;
    const python = spawn('python3', ['./python/predict.py', url]);
    python.stdout.on('data', function(data){
        rawString = data.toString();
    })

    python.on('close', function(code){
        console.log("predict close with code" + code);
        try {
            result = replaceAll(rawString, "'", '"')
            res.json(JSON.parse(result))    
        } catch (error) {
            res.json({"message": error})
        }
        
    })

   })


module.exports = router;
