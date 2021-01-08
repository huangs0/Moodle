/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();

// Get every source under a course, return a JSON Object containing all the source under a course
router.get('/:course_id',(req,res)=>{
    // Get the main page of source
    var lecture = [], tutorial = [], workshop = [], reading = [], assignment = [];
    req.sql.query(`SELECT type, title, file_name FROM source WHERE course_id = ${req.params.course_id};`,(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.json({
                status:false,
                error: 'Fail to select from database'
            });
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
            res.json({
                status: true,
                source: {
                lecture: lecture,
                tutorial: tutorial,
                workshop: workshop,
                reading: reading,
                assignment: assignment
                }
            })
        }
    })
})

// Register a source by providing course_id, section_id or subsection_id(Return by sectionRouter), type, title, file_name(Return by the fileRouter)
router.post('/:course_id',(req,res)=>{
    if (req.identity != 'instructor'){
        res.json({
            status: false,
            error: 'You are not instructor'
        });
    }
    req.sql.query(`SELECT instructor FROM course WHERE course_id = '${req.params.course_id}';`,(err,results,fields)=>{
        let instructor = JSON.parse(results[0].instructor);
        if (instructor.indexOf(req.cookies.uid) == -1){
            res.json({
                status:false,
                error: 'You are not instructor of this course'
            });
        }
    })
    if (req.body.type == 'lecture'){
        req.sql.query(`INSERT INTO source (course_id,type,title,file_name,section_id) VALUES ('${req.params.course_id}','lecture','${req.body.title}','${req.body.file_name}','${req.body.section_id}');`
        ,(err,results,fields)=>{
            if (err){
                console.log(err.messages);
                res.json({
                    status:false,
                    error: 'Fail to add to database'
                });
            }
            else {
                res.json({
                    status:true
                });
            }
        })
    }
    // If type = assignment, read the assignment_id
    else if (req.body.type == 'assignment'){
        req.sql.query(`INSERT INTO source (course_id,type,title,file_name,assignment_id) VALUES ('${req.params.course_id}','${req.body.type}','${req.body.title}','${req.body.file_name}','${req.body.assignment_id}');`
        ,(err,results,fields)=>{
            if (err){
                console.log(err.messages);
                res.json({
                    status:false,
                    error: 'Fail to add to database'
                });
            }
            else {
                res.json({
                    status:true
                });
            }
        })
    }
    // If type != course or assignment, read the subsection_id
    else {
        req.sql.query(`INSERT INTO source (course_id,type,title,file_name,subsection_id) VALUES ('${req.params.course_id}','${req.body.type}','${req.body.title}','${req.body.file_name}','${req.body.subsection_id}');`
        ,(err,results,fields)=>{
            if (err){
                console.log(err.messages);
                res.json({
                    status:false,
                    error: 'Fail to add to database'
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


module.exports = router;
