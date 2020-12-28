let express = require('express');
let router = express.Router();
let formidable = require('formidable');
let fs = require('fs');
let path = require('path');

/**
 * Protocol for request under this router
 * Currently, all file upload should follow one file, one request principle
 * Upload multiple file in a time is still under development
 * No GET Request will be handled, this router is only for POST new file
 * 1. '/source/:course_id' POST: please set type='file' and content-type is 'multipart/form-data'
 * course_id should be provided in url
 * Server->Client: Text Message, if 'Fail' server fail to handle your file upload
 * If successfully upload, server will send back name of this file under folder
 * 2. '/submission/:course_id' POST: please set type='file' and content-type is 'multipart/form-data'
 * course_id should be provided in url
 * Server->Client: Text Message, if 'Fail' server fail to handle your file upload
 * If successfully upload, server will send back time of submission and name of this file under folder
 */

router.post('/source/:course_id',(req,res)=>{
    let form = formidable({
        multiple: false,
        keepExtensions: true,
        uploadDir: path.join(__dirname,'../..','source','../..',req.params.course_id)
    })
    form.parse(req, (err, fields, files)=>{
        if (err){
            console.log(err.messages);
            res.send('Fail');
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
                }
                else {
                    res.send(newName);
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
            res.send('Fail');
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
                }
                else {
                    res.send({
                        time: time,
                        file_name: newName
                    });
                }
            })
        }
    })
})

module.exports = router;