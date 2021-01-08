/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();

router.get('/:course_id',(req,res)=>{
    // Select title of class from course
    req.sql.query(`SELECT title FROM course WHERE course_id = '${req.params.course_id}';`,(err, results, fields)=>{
        if (err || results.length == 0){
            res.json({status:false,error:'Fail to get course title'});
        }
        else {
            req.title = results[0].title;
        }
    })
    // Select sections of class from section
    req.sql.query(`SELECT section_id,title,content FROM section WHERE course_id = '${req.params.course_id}';`,(err,results,fields)=>{
        if (err || results.length == 0){
            res.json({status:false,error:'Fail to get sections'})
        }
        else {
            req.sections = results;
            req.sections.sort((a,b) => {a.section_id-b.section_id});// Sort the section in order of section_id ascending
        }
    })
    for (let i = 0; i < req.sections.length; i++){
        // For every section, select corresponding source from source database
        req.sql.query(`SELECT title, file_name FROM source WHERE section_id = '${req.sections[i].section_id}';`,(err, results, fields)=>{
            if (err){
                console.log(err.messages);
                res.json({status:false,error:'Fail to get section details'});
            }
            else {
                req.sections[i].source = results;
            }
        })
        // Select subsection according to sections
        req.sql.query(`SELECT title, type, content, subsection_id FROM subsection WHERE section_id = '${req.sections[i].section_id}';`,(err,results,fields)=>{
            if (err){
                console.log(err.messages);
                res.json({status:false,error:'Fail to get subsections'});
            }
            else {
                req.sections[i].subsection = results;
            }
            // For every subsection, select source from source database
            for (let j = 0; j < req.sections[i].subsection.length; j++){
                req.sql.query(`SELECT title, file_name FROM source WHERE subsection_id = '${req.sections[i].subsection[j].subsection_id}';`,(err,results,fields)=>{
                    if (err){
                        console.log(err.messages);
                        res.json({status:false,error:'Fail to get subsection details'});
                    }
                    else {
                        req.sections[i].subsection[j].source = results;
                    }
                })
            }
        })
    }
    res.json({
        status: true,
        title: req.title, 
        section: req.secrions});
})

module.exports = router;
