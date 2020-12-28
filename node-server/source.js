let express = require('express');
let router = express.Router();

/**
 * Protocol for request under this router
 * 1. '/:course_id' GET: course_id should be provided in url
 * Server->Client: JSON Object {lecture,tutorial,workshop,reading,assignment} five keys, 
 * each key is an JSON array contain all resource under that type
 * Each entry under subarray has two attribute: title and file_name
 * 2. '/add/:course_id' POST: course_id should be provided in url
 * POST Body should have title, file_name as compulsory part
 * AND section_id if want to add new source in a new section (i.e. Lecture)
 * OR subsection_id if want to add new source in new subsection (i.e. Workshop, Reading, Tutorial)
 * OR assignment_id if want to add new source in new assignment
 */

// Get every source under a course, return a JSON Object containing all the source under a course
router.get('/:course_id',(req,res)=>{
    // Get the main page of source
    var lecture = [], tutorial = [], workshop = [], reading = [], assignment = [];
    req.sql.query('SELECT `type`, `title`, `file_name` FROM `source` WHERE `course_id` = `'
    +req.params.course_id+'`;',(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.json('Fail');
        }
        else {
            for (let i = 0; i < results.length; i++){
                if (results[i].type == 'lecture'){
                    lecture.push({
                        title: results[i].title,
                        file_name: results[i].file_name
                    })
                }
                else if (results[i].type == 'tutorial'){
                    tutorial.push({
                        title: results[i].title,
                        file_name: results[i].file_name
                    })
                }
                else if (results[i].type == 'workshop'){
                    workshop.push({
                        title: results[i].title,
                        file_name: results[i].file_name
                    })
                }
                else if (results[i].type == 'reading'){
                    reading.push({
                        title: results[i].title,
                        file_name: results[i].file_name
                    })
                }
                else if (results[i].type == 'assignment'){
                    assignment.push({
                        title: results[i].title,
                        file_name: results[i].file_name
                    })
                }
            }
        }
    })
    res.json({
        lecture: lecture,
        tutorial: tutorial,
        workshop: workshop,
        reading: reading,
        assignment: assignment
    })
})

// Register a source by providing course_id, section_id or subsection_id(Return by sectionRouter), type, title, file_name(Return by the fileRouter)
router.post('/add/:course_id',(req,res)=>{
    // If type = lecture, read the section_id
    if (req.body.type == 'lecture'){
        req.sql.query('INSERT INTO `source` (`course_id`,`type`,`title`,`file_name`,`section_id`) VALUES (`'+req.params.course_id
        +'`,`lecture`,`'+req.body.title+'`,`'+req.body.file_name+'`,`'+req.body.section_id+'`);',(err,results,fields)=>{
            if (err){
                console.log(err.messages);
                res.send('Fail');
            }
            else {
                res.send('Success');
            }
        })
    }
    // If type = assignment, read the assignment_id
    else if (req.body.type == 'assignment'){
        req.sql.query('INSERT INTO `source` (`course_id`,`type`,`title`,`file_name`,`assignment_id`) VALUES (`'+req.params.course_id
        +'`,`'+req.body.type+'`,`'+req.body.title+'`,`'+req.body.file_name+'`,`'+req.body.assignment_id+'`);',(err,results,fields)=>{
            if (err){
                console.log(err.messages);
                res.send('Fail');
            }
            else {
                res.send('Success');
            }
        })
    }
    // If type != course or assignment, read the subsection_id
    else {
        req.sql.query('INSERT INTO `source` (`course_id`,`type`,`title`,`file_name`,`subsection_id`) VALUES (`'+req.params.course_id
        +'`,`'+req.body.type+'`,`'+req.body.title+'`,`'+req.body.file_name+'`,`'+req.body.subsection_id+'`);',(err,results,fields)=>{
            if (err){
                console.log(err.messages);
                res.send('Fail');
            }
            else {
                res.send('Success');
            }
        })
    }
})


module.exports = router;