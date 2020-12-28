let express = require('express');
let router = express.Router();

/**
 * Protocol for request under this router
 * 1. '/main/:course_id' POST: couse_id should provide in url
 * POST body should have title, content as compulsory part
 * Server->Client: Text Message, 'Fail' if server fail to process your request or section_id if success
 * 2. '/sub/:section_id' POST: section_id should provide in url
 * POST body should have title, content, type as compulsory part
 * Server->Client: Text Message, 'Fail' if server fail to process your request or subsection_id if success
 */

// Add new section to a course
router.post('/main/:course_id',(req,res)=>{
    if (req.identity != 'instructor'){
        res.end('Fail');
    }
    req.sql.query('SELECT `instructor` FROM `course` WHERE `course_id` = '+req.params.course_id+';',(err,results,fields)=>{
        let instructor = JSON.parse(results[0].instructor);
        if (instructor.indexOf(req.cookies.uid) == -1){
            res.end('Fail');
        }
    })
    req.sql.query('INSERT INTO `section` (`course_id`,`title`,`content`,`type`) VALUES (`'+req.params.course_id,
    +'`,`'+req.body.title+'`,`'+req.body.content+'`,`lecture`);',(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.end('Fail');
        }
    })
    req.sql.query('SELECT `section_id` FROM `section` WHERE `title` = '+req.body.title+' AND `course_id` = '
    +req.params.course_id+';',(err, results, fields)=>{
        if (err){
            console.log(err.message);
        }
        else {
            // send back section_id for register source
            res.send(results[0].section_id);
        }
    })
})

// Add a subsection to a main section, i.e. Tutorial or Workshop or Readings to the Lecture
router.post('/sub/:section_id',(req,res)=>{
    if (req.identity != 'instructor'){
        res.end('Fail');
    }
    req.sql.query('SELECT `instructor` FROM `course` WHERE `course_id` = '+req.params.course_id+';',(err,results,fields)=>{
        let instructor = JSON.parse(results[0].instructor);
        if (instructor.indexOf(req.cookies.uid) == -1){
            res.end('Fail');
        }
    })
    req.sql.query('SELECT `course_id` FROM `section` WHERE `section_id` = '+req.params.section_id+';',(err,results,fields)=>{
        if (err){
            console.log(err.message);
            res.end('Fail');
        }
        else {
            req.course_id = results[0].course_id;
        }
    })
    // Add the subsection to the subsection database
    req.sql.query('INSERT INTO `subsection` (`title`,`type`,`content`,`section_id`,`course_id`) VALUES (`'+
    req.body.title+'`,`'+req.body.type+'`,`'+req.body.content+'`,`'+req.params.section_id+'`,`'+req.course_id+'`);',(err,results,fields)=>{
        if (err){
            console.log(err.message);
            res.end('Fail');
        }
    })
    req.sql.query('SELECT `subsection_id` FROM `subsection` WEHRE `title` = `'+req.body.title+'` AND `type` = `'+req.body.type+'` AND `section_id` = `'+req.params.section_id+'`;', (err,results,fields)=>{
        if (err){
            console.log(err.message);
            res.end('Fail');
        }
        else {
            // Send back the subsection_id for register source
            res.send(results[0].subsection_id);
        }
    })
})

// THE FOLLOWING PART IS IN AS-IS STATUS
// Get a section?
router.get('/:course_id',(req,res)=>{
    req.sql.query('SELECT `title`, `section_id` FROM `section` WHERE `course_id` = '+req.params.course_id+';',(err,results,fields)=>{
        if (err){
            console.log(err.message);
            res.send('Fail');
        }
        else {
            let return_json = [];
            for (let i = 0; i < results.length; i++){
                return_json.push({
                    title: results[i].title,
                    section_id: results[i].section_id
                })
            }
            res.json(return_json);
        }
    })
})

module.exports = router;