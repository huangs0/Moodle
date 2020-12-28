let express = require('express');
let router = express.Router();
let fs = require('fs');

/**
 * Protocol for request under this router
 * 1. '/'Get: '/course_id', should provide course_id in the url
 * Server->Client: JSON Array, if first entry is 'Fail' then submission is illegal
 * Else, every entry is an assignment under this course, with assignment_id, title, content, deadline, source and submission
 * If you're the instructor: .submission will contain all the submissions for this course
 * If you're the participator: .submission will contain all your submission
 * 2. '/new/'POST: '/new/course_id', should provide course_id in the url
 *    Meanwhile, in POST body, it should have three compulsory part:
 *    Title: title of assignemnt, Content: Description of it, Deadline: Dur of Assignment
 * Server->Client: Text Message, if 'Success', server has created a new assignment while 'False' means server fail to handle you request
 * 3. '/submit'POST: '/submit/assignment_id', should give assignment_id in the url
 *    Meanwhile, in POST body, it should have time and file_name as compulsory part
 * Server->Client: Text Message 'Fail' means fail to record submission, 'Success' means successfully record your submission
 */

router.get('/:course_id',(req,res)=>{
    req.sql.query('SELECT `assignment_id`,`title`,`content`,`deadline` FROM `assignment` WHERE `course_id` = `'+req.params.course_id+'`;',(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.json(['Fail']);
            return;
        }
        else {
            for (let i = 0; i < results.length;i++){
                req.sql.query('SELECT `title`,`file_name` FROM `source` WHERE `assignment_id` = `'+results[i].assignment_id+'`;',(err,rows,fields)=>{
                    if (err){
                        console.log(err.messages);
                        res.json(['Fail']);
                    }
                    else {
                        results[i].source = rows;
                    }
                })
                if (req.identity = 'participator'){
                    req.sql.query('SELECT `time`,`file_name` FROM `submission` WHERE `assignment_id` = `'+results[i].assignment_id+'` AND `user_id` = `'+req.cookies.uid+'`;',(err,rows,fields)=>{
                        if (err){
                            console.log(err.messages);
                            res.json(['Fail']);
                        }
                        else {
                            results[i].submission = rows;
                        }
                    })
                }
                else if (req.identity = 'instructor') {
                    req.sql.query('SELECT `time`,`file_name` FROM `submission` WHERE `assignment_id` = `'+results[i].assignment_id+'`;',(err,rows,fields)=>{
                        if (err){
                            console.log(err.messages);
                            res.json(['Fail']);
                        }
                        else {
                            results[i].submission = rows;
                        }
                    })
                }
            }
        }
        res.json(results);
    })
})

// Post new assignments, create a new folder accordingly
router.post('/new/:course_id',(req,res)=>{
    req.sql.query('INSERT INTO `assignment` (`course_id`,`title`,`content`,`deadline`) VALUES (`'+req.params.course_id+
    '`,`'+req.body.title+'`,`'+req.body.content+'`,`'+req.body.deadline+'`);',(err, results, fields)=>{
        if (err){
            console.log(err.messages);
            res.send('Fail');
        }
        else {
            req.sql.query('SELECT `assignment_id` FROM `assignment` WHERE `course_id` = `'+req.params.course_id+
            '` AND `title` = `'+req.body.title+'`;',(err, rows, fields)=>{
                if (err){
                    console.log(err.messages);
                    res.send('Fail')
                }
                else {
                    // Please don't make seperate folder for routes
                    fs.mkdir('file/'+assignment_id,(err)=>{
                        if (err){
                            console.log(err)
                            res.send('Fail')
                        }
                        else {
                            res.send('Success')
                        }
                    })
                }
            })
        }
    })
})

// Submit the Submission
router.post('/submit/:assignment_id',(req,res)=>{
    // User will send the file_name, time, user_id is in req.cookies.uid, assignment_id is in assignment_id
    req.sql.query('INSERT INTO `submission` (`assignment_id`,`user_id`,`time`,`file_name`) VALUES (`'+req.params.assignment_id
    +'`,`'+req.cookies.uid+'`,`'+req.body.time+'`,`'+req.body.file_name+'`);',(err,results,fields)=>{
        if (err){
            console.log(err.messages)
            res.send('Fail')
        }
        else {
            res.send('Success')
        }
    })
})

module.exports = router;