let express = require('express');
let router = express.Router();

/**
 * Protocol for request under this router
 * 1. '/:course_id' GET: course_id should provide in url
 * Server->Client: JSON Array of news in time order
 * Each Element (Object) has four attribute {time,title,content,creator_name}
 * 2. '/new/:course_id' POST: course_id should provide in url
 * POST body should havd title and content as compulsory part
 * Server->Client: Text Message if 'Success' the news has been post successfully, otherwise is failed
 */

// Get the news posted by the instructor
router.get('/:course_id',(req,res)=>{
    req.sql.query('SELECT `time`,`title`,`content`,`creator_name` FROM `news` WHERE `course_id` = `'+req.params.course_id+'`;',(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.json(['Fail']);
        }
        else {
            // Here remains a question, What's the value returned by mysql database? Is it comparable?
            results.sort((a,b)=>{a.time>b.time?1:-1;});
            res.json(results);
        }
    })
})

// Post news to news forum
router.post('/new/:course_id',(req,res)=>{
    // Check the identity
    if (req.identity != 'instructor'){
        res.end('You are not the instructor, not permit to post new section');
    }
    req.sql.query('SELECT `instructor` FROM `course` WHERE `course_id` = '+req.params.course_id+';',(err,results,fields)=>{
        let instructor = JSON.parse(results[0].instructor);
        if (instructor.indexOf(req.cookies.uid) == -1){
            res.end('You are not the instructor of this course, please contact IT service for more details');
        }
    })
    req.sql.query('INSERT INTO `news` (`course_id`,`time`,`title`,`content`,`creator_name`) VALUES (`'+req.params.course_id+'`,`'+
    Date.now()+'`,`'+req.body.title+'`,`'+req.body.content+'`,`'+req.name+'`);',(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.send('Fail');
        }
        else {
            res.send('Success');
        }
    })
})

module.exports = router;