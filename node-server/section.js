/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();

// Add new section to a course
router.post('/section/:course_id',(req,res)=>{
    if (req.identity != 'instructor'){
        res.json({
            status:false,
            error: 'You are not the instructor'
        });
    }
    req.sql.query(`SELECT instructor FROM course WHERE course_id = '${req.params.course_id}';`,(err,results,fields)=>{
        let instructor = JSON.parse(results[0].instructor);
        if (instructor.indexOf(req.cookies.uid) == -1){
            res.json({
                status:false,
                error: 'You are not the instructor of this course'
            });
        }
    })
    req.sql.query(`INSERT INTO section (course_id,title,content,type) VALUES ('${req.params.course_id}','${req.body.title}','${req.body.content}','lecture');`
    ,(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.json({
                status:false,
                error: 'Fail to post to database'
            });
        }
    })
    req.sql.query(`SELECT section_id FROM section WHERE title = '${req.body.title}' AND course_id = '${req.params.course_id}';'`
    ,(err, results, fields)=>{
        if (err){
            console.log(err.message);
        }
        else {
            // send back section_id for register source
            res.json({
                status: true,
                section_id: results[0].section_id
            });
        }
    })
})

// Add a subsection to a main section, i.e. Tutorial or Workshop or Readings to the Lecture
router.post('/subsection/:section_id',(req,res)=>{
    if (req.identity != 'instructor'){
        res.json({
            status:false,
            error: 'You are not the instructor'
        });
    }
    req.sql.query(`SELECT instructor FROM course WHERE course_id = '${req.params.course_id}';`,(err,results,fields)=>{
        let instructor = JSON.parse(results[0].instructor);
        if (instructor.indexOf(req.cookies.uid) == -1){
            res.json({
                status:false,
                error: 'You are not the instructor of this class'
            });
        }
    })
    req.sql.query(`SELECT course_id FROM section WHERE section_id = '${req.params.section_id}';`,(err,results,fields)=>{
        if (err){
            console.log(err.message);
            res.json({
                status: false,
                error: 'Fail to select from database'
            });
        }
        else {
            req.course_id = results[0].course_id;
        }
    })
    // Add the subsection to the subsection database
    req.sql.query(`INSERT INTO subsection (title,type,content,section_id,course_id) VALUES ('${req.body.title}','${req.body.type}','${req.body.content}','${req.params.section_id}','${req.course_id}');`
        ,(err,results,fields)=>{
        if (err){
            console.log(err.message);
            res.json({
                status:false,
                error: 'Fail to add to database'
            });
        }
    })
    req.sql.query(`SELECT subsection_id FROM subsection WEHRE title = '${req.body.title}' AND type = '${req.body.type}' AND section_id = '${req.params.section_id}';`, (err,results,fields)=>{
        if (err){
            console.log(err.message);
            res.json({
                status:false,
                error: 'Fail to select from database'
            });
        }
        else {
            // Send back the subsection_id for register source
            res.json({
                status: true,
                subsection_id: results[0].subsection_id}
            );
        }
    })
})

module.exports = router;
