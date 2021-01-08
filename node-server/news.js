/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();

// Get the news posted by the instructor
router.get('/:course_id',(req,res)=>{
    req.sql.query(`SELECT time,title,content,creator_name FROM news WHERE course_id = '${req.params.course_id}';'`,(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.json({status:false,error:'Fail to SELECT from database'});
        }
        else {
            // Here remains a question, What's the value returned by mysql database? Is it comparable?
            results.sort((a,b)=>{a.time>b.time?1:-1;});
            res.json({
                status:true,
                news: results
            });
        }
    })
})

// Post news to news forum
router.post('/:course_id',(req,res)=>{
    // Check the identity
    if (req.identity != 'instructor'){
        res.json({
            status:false,
            error:'You are not the instructor, not permit to post new section'
        });
    }
    req.sql.query(`SELECT instructor FROM course WHERE course_id = '${req.params.course_id}';`,(err,results,fields)=>{
        let instructor = JSON.parse(results[0].instructor);
        if (instructor.indexOf(req.cookies.uid) == -1){
            res.json({
                status:false,
                error:'You are not the instructor of this course, please contact IT service for more details'});
        }
    })
    req.sql.query(`INSERT INTO news (course_id,time,title,content,creator_name) VALUES ('${req.params.course_id}','${Date.now()}','${req.body.title}','${req.body.content}','${req.name}');`
    ,(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.json({
                status: false,
                error: 'Fail to add record in database'
            });
        }
        else {
            res.json({
                status: true
            });
        }
    })
})

module.exports = router;
