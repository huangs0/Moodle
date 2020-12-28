let express = require('express');
let router = express.Router();

/**
 * Protocol for request under this router
 * 1. '/:course_id' GET: course_id should provide in url
 * Server->Client: JSON Array, if first entry is 'Fail', server fail to handle your request
 * if success, then first entry is title of this course
 * second entry is the sections of this course, in JSON Array format
 * Every Element (object) in Second Entry has {section_id, title, content, source, subsection}
 * source is an array with each entry (an object) has {title, file_name} two attribute
 * subsection is an array with each entry (object) has {subsection_id, title, content, source}
 * source is an array with each entry (an object) has {title, file_name} two attribute
 *  */

router.get('/:course_id',(req,res)=>{
    // Select title of class from course
    req.sql.query('SELECT `title` FROM `course` WHERE `course_id` = '+req.params.course_id+';',(err, results, fields)=>{
        if (err || results.length == 0){
            res.json(['Fail']);
        }
        else {
            req.title = results[0].title;
        }
    })
    // Select sections of class from section
    req.sql.query('SELECT `section_id`,`title`,`content`, FROM `section` WHERE `course_id` = '+req.params.course_id+';',(err,results,fields)=>{
        if (err || results.length == 0){
            res.json(['Fail'])
        }
        else {
            req.sections = results;
            req.sections.sort((a,b) => {a.section_id-b.section_id});// Sort the section in order of section_id ascending
        }
    })
    for (let i = 0; i < req.sections.length; i++){
        // For every section, select corresponding source from source database
        req.sql.query('SELECT `title`, `file_name` FROM `source` WHERE `section_id` = '+req.sections[i].section_id+';',(err, results, fields)=>{
            if (err){
                console.log(err.messages);
                res.json(['Fail']);
            }
            else {
                req.sections[i].source = results;
            }
        })
        // Select subsection according to sections
        req.sql.query('SELECT `title`, `type`, `content`, `subsection_id` FROM `subsection` WHERE `section_id` = '+req.sections[i].section_id+';',(err,results,fields)=>{
            if (err){
                console.log(err.messages);
                res.json(['Fail']);
            }
            else {
                req.sections[i].subsection = results;
            }
            // For every subsection, select source from source database
            for (let j = 0; j < req.sections[i].subsection.length; j++){
                req.sql.query('SELECT `title`, `file_name` FROM `source` WHERE `subsection_id` = '+req.sections[i].subsection[j].subsection_id+';',(err,results,fields)=>{
                    if (err){
                        console.log(err.messages);
                        res.json(['Fail']);
                    }
                    else {
                        req.sections[i].subsection[j].source = results;
                    }
                })
            }
        })
    }
    res.json([req.title, req.secrions]);
})

module.exports = router;