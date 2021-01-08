/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();
let fs = require('fs');

// Submit the Submission
router.post('/submission/:assignment_id',(req,res)=>{
    if (req.identity != 'participator'){
        res.json({
            status:false,
            error:'You are not participator'
        });
    }
    req.sql.query(`SELECT participator FROM course WHERE course_id = '${req.params.course_id}';`,(err,results,fields)=>{
        let participator = JSON.parse(results[0].participator);
        if (participator.indexOf(req.cookies.uid) == -1){
            res.json({
                status: false,
                error: 'You are not participators of this class'
            });
        }
    })
    // User will send the file_name, time, user_id is in req.cookies.uid, assignment_id is in assignment_id
    req.sql.query(`INSERT INTO submission (assignment_id,user_id,time,file_name) VALUES ('${req.params.assignment_id}','${req.cookies.uid}','${req.body.time}','${req.body.file_name}');`
    ,(err,results,fields)=>{
        if (err){
            console.log(err.messages)
            res.json({
                status: false,
                error: 'Fail to add to database'
            })
        }
        else {
            res.json({
                status:true
            });
        }
    })
})

// Post new assignments, create a new folder accordingly
router.post('/:course_id',(req,res)=>{
    if (req.identity != 'instructor'){
        res.json({
            status: false,
            error: 'You are not the instructor'
        });
    }
    req.sql.query(`SELECT instructor FROM course WHERE course_id = '${req.params.course_id}';`,(err,results,fields)=>{
        let instructor = JSON.parse(results[0].instructor);
        if (instructor.indexOf(req.cookies.uid) == -1){
            res.json({
                status: false,
                error: 'You are not instructor of this class'
            });
        }
    })
    req.sql.query(`INSERT INTO assignment (course_id,title,content,deadline) VALUES ('${req.params.course_id}','${req.body.title}','${req.body.content}','${req.body.deadline}');`
    ,(err, results, fields)=>{
        if (err){
            console.log(err.messages);
            res.json({
                status: false,
                error: 'Fail to add to database'
            });
        }
        else {
            req.sql.query(`SELECT assignment_id FROM assignment WHERE course_id = '${req.params.course_id}' AND title = '${req.body.title}';`,(err, rows, fields)=>{
                if (err){
                    console.log(err.messages);
                    res.json({
                        status: false,
                        error: 'Fail to select from database'
                    });
                }
                else {
                    // Please don't make seperate folder for routes
                    fs.mkdir('file/'+assignment_id,(err)=>{
                        if (err){
                            console.log(err)
                            res.json({
                                status:false,
                                error: 'Fail to create folder'
                            });
                        }
                        else {
                            res.json({
                                status:true
                            });
                        }
                    })
                }
            })
        }
    })
})

router.get('/:course_id',(req,res)=>{
    req.sql.query(`SELECT assignment_id,title,content,deadline FROM assignment WHERE course_id = '${req.params.course_id}';`,(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.json({
                status: false,
                error: 'Fail to select from database'
            });
        }
        else {
            for (let i = 0; i < results.length;i++){
                req.sql.query(`SELECT title,file_name FROM source WHERE assignment_id = ${results[i].assignment_id};`,(err,rows,fields)=>{
                    if (err){
                        console.log(err.messages);
                        res.json({
                            status: false,
                            error: 'Fail to select from database'
                        });
                    }
                    else {
                        results[i].source = rows;
                    }
                })
                if (req.identity = 'participator'){
                    req.sql.query(`SELECT time,file_name FROM submission WHERE assignment_id = '${results[i].assignment_id}' AND user_id = '${req.cookies.uid}';`,(err,rows,fields)=>{
                        if (err){
                            console.log(err.messages);
                            res.json({
                                status:false,
                                error:'Fail to select from database'
                            })
                        }
                        else {
                            results[i].submission = rows;
                        }
                    })
                }
                else if (req.identity = 'instructor') {
                    req.sql.query(`SELECT time,file_name FROM submission WHERE assignment_id = '${results[i].assignment_id}';`,(err,rows,fields)=>{
                        if (err){
                            console.log(err.messages);
                            res.json({
                                status:false,
                                error:'Fail to select from database'
                            })
                        }
                        else {
                            results[i].submission = rows;
                        }
                    })
                }
            }
            res.json({
                status:true,
                assignment:results
            });
        }
    })
})

module.exports = router;
