/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'


router.post('/source/:course_id',(req,res)=>{
    let form = formidable({
        multiple: false,
        keepExtensions: true,
        uploadDir: path.join(__dirname,'../..','source','../..',req.params.course_id)
    })
    form.parse(req, (err, fields, files)=>{
        if (err){
            console.log(err.messages);
            res.json({
                status:false,
                error: 'Fail to upload files'
            });
        }
        else {
            console.log(files);
            console.log(fields);
            let newName = ''+Date.now()+files.file.name;
            let newPath = path.join(path.dirname(files.file.path),newName);
            // Use fs.rename to move files
            fs.rename(files.file.path, newPath, (err)=>{
                if (err){
                    console.log(err);
                    res.json({
                        status:false,
                        error: 'Fail to save files'
                    })
                }
                else {
                    res.json({
                        status: true,
                        file_name: newName
                    });
                }
            })
        }
    })
})

router.post('/submission/:assignment_id',(req,res)=>{
    let form = formidable({
        multiple: false,
        keepExtensions: true,
        uploadDir: path.join(__dirname,'../..','assignment','../..',req.params.assignment_id)
    })
    form.parse(req,(err, fields, files)=>{
        if (err){
            console.log(err.messages);
            res.json({
                status:false,
                error: 'Fail to upload files'
            });
        }
        else {
            console.log(files);
            console.log(fields);
            let time = Date.now();
            let newName = ''+time+req.cookies.uid;
            let newPath = path.join(path.dirname(files.file.path),newName);
            fs.rename(files.file.path, newPath, (err)=>{
                if (err){
                    console.log(err);
                    res.json({
                        status:false,
                        error: 'Fail to save files'
                    })
                }
                else {
                    res.json({
                        status: true,
                        time: time,
                        file_name: newName
                    });
                }
            })
        }
    })
})

module.exports = router;
