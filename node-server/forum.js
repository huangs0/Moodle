/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();

 // Post new answer to database
router.post('/question/:course_id',(req,res)=>{
    req.sql.query(`INSERT INTO question (course_id,creator_name,title,content,topic,time) VALUES ('${req.params.course_id}','${req.name}','${req.body.title}','${req.body.content}','${req.body.topic}','${Date.now()}');`
    ,(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.json({status:false,error:'Fail to Post change to Database'});
        }
        else {
            res.json({status:true});
        }
    })
})

// Post new question to database
router.post('/answer/:question_id',(req,res)=>{
    // question_id is in req.params, creator_name is in req.name, content is provided in req.body, time is Data.now()
    req.sql.query(`INSERT INTO answer (question_id,creator_name,content,time) VALUES ('${req.params.question_id}','${req.name}','${req.body.content}','${Date.now()}');`
        ,(err,results,fields)=>{
        if (err){
            console.log(err.messages);
            res.send({status:false,error:'Fail to Post change to Database'});
        }
        else {
            res.send({status:true});
        }
    })
})

// Get the question with answers
router.get('/:course_id',(req,res)=>{
    req.sql.query(`SELECT question_id,creator_name,title,content,time,topic FROM question WHERE course_id = '${req.params.course_id}';`,(err,results,fields)=>{
        if (err) {
            console.log(err.messages);
            res.json({status:false,error:'Fail to get questions from database'})
        }
        else {
            for (let i = 0; i < results.length; i++){
                req.sql.query(`SELECT creator_name, content, time FROM answer WHERE question_id = '${results[i].question_id}';`,(err,rows,fields)=>{
                    if (err){
                        console.log(err.messages);
                        res.json({status:false,error:'Fail to get answers from database'});
                    }
                    else {
                        // Query Success, add the result to answer of results;
                        results[i].answer = rows;
                    }
                })
            }
            results.sort((a,b)=>{a.time>b.time?1:-1;})
            res.json({
                status:true,
                question: results
            });
        }
    })
})

module.exports = router;
