/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();

router.get('/',(req, res)=>{
    req.sql.query(`SELECT message_id, title, content FROM message WHERE user_id = '${req.cookies.uid}';`, (err,results,fields)=>{
        if (err) {
            console.log(err.messages);
            res.json({status:false,error:'Fail to select from database'});
        }
        else {
            let res_json = [];
            for (let i = 0; i < results.length; i++){
                res_json.push({
                    message_id: resutls[i].message_id,
                    title: results[i].title,
                    content: results[i].content
                })
            }
            res.json({
                status:true,
                message:res_jsonti
            });
        }
    })
})

router.delete('/:message_id',(req,res)=>{
    req.sql.query(`DELETE FROM message WHERE message_id = '${req.params.message_id}';`, (err, results, fields)=>{
        if (err) {
            console.log(err.messages);
            res.send({status:false,error:'Fail to Delete in Database'});
        }
        else {
            res.send({status:true});
        }
    })
})

module.exports = router;
