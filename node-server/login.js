/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();

router.post('/',(req,res)=>{
    let user_id = req.body.user_id;
    req.sql.query(`SELECT password FROM login WHERE user_id = '${user_id}';`, (err, results, fields)=>{
        if (err){
            res.json({error:'Database Failed', status:false});
        }
        else if (results.length == 0){
            res.json({error:'No that user',status:false});
        }
        else if (results[0].password != req.body.password){
            res.json({error:'Password not match',status:false})
        }
        else {
            res.cookie('uid',user_id,{maxAge:300000});
            res.send({status:true});
        }
    })
})

module.exports = router;
