let express = require('express');
let router = express.Router();

/**
 * Protocol for request under this router
 * '/' POST: POST body should have user_id and password as compulsory part
 * Server->Client: 'Fail' if login fail and 'Success' if login success
 */

router.post('/',(req,res)=>{
    let user_id = req.body.user_id;
    req.sql.query('SELECT `password` FROM login WHERE `user_id` = '+user_id+';', (err, results, fields)=>{
        if (err || results.length == 0 || results[0].password != req.body.password){
            res.send('Fail');
        }
        else {
            res.cookie('uid',user_id,{maxAge:300000});
            res.send('Success');
        }
    })
})

module.exports = router;