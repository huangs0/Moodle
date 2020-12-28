let express = require('express');
let router = express.Router();

/**
 * Protocol for request under this router
 * 1. '/:course_id' GET: course_id should provide in url
 * Server->Client: JSON Array of questions in time order
 * Each Entry (Object) have {question_id, creator_name, title, content, time, topic, answer} 7 attribute
 * answer is an JSON Array, each entry, as an object has {creator_name, content, time} three attribute
 * 2. '/question/:question_id' POST: course_id should provide in url
 * POST body should have title, content, topic as compulsory part
 * Server->Client: Text Message, if 'Success' server has successfully record new question, 'Fail' instead
 * 3. '/answer/:question_id' POST: question_id should provide in url
 * POST body should have content as compulsory part
 * Server->Client: Text Message, if 'Success' server has successfully record new question, 'Fail' instead
 */

 // Post new answer to database
router.post('/question/:course_id',(req,res)=>{
    req.sql.query('INSERT INTO `question` (`course_id`,`creator_name`,`title`,`content`,`topic`,`time`) VALUES (`'+req.params.course_id+
    '`,`'+req.name+'`,`'+req.body.title+'`,`'+req.body.content+'`,`'+req.body.topic+'`,`'+Date.now()+'`);',(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.send('Fail');
        }
        else {
            res.send('Success');
        }
    })
})

// Post new question to database
router.post('/answer/:question_id',(req,res)=>{
    // question_id is in req.params, creator_name is in req.name, content is provided in req.body, time is Data.now()
    req.sql.query('INSERT INTO `answer` (`question_id`,`creator_name`,`content`,`time`) VALUES (`'+
    req.params.question_id+'`,`'+req.name+'`,`'+req.body.content+'`,`'+Date.now()+'`);',(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.send('Fail');
        }
        else {
            res.send('Success');
        }
    })
})

// Get the question with answers
router.get('/:course_id',(req,res)=>{
    req.sql.query('SELECT `question_id`,`creator_name`,`title`,`content`,`time`,`topic` FROM `question` WHERE `course_id` = `'+req.params.course_id+'`;',(err,results,fields)=>{
        if (err) {
            console.log(err.messages);
            res.json(['Fail'])
        }
        else {
            for (let i = 0; i < results.length; i++){
                req.sql.query('SELECT `creator_name`, `content`, `time` FROM `answer` WHERE `question_id` = `'+results[i].question_id+'`;',(err,rows,fields)=>{
                    if (err){
                        console.log(err.messages);
                        res.json(['Fail']);
                    }
                    else {
                        // Query Success, add the result to answer of results;
                        results[i].answer = rows;
                    }
                })
            }
            results.sort((a,b)=>{a.time>b.time?1:-1;})
            res.json(results);
        }
    })
})

module.exports = router;