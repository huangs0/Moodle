let express = require('express');
let router = express.Router();

/**
 * Protocol for request under this router
 * 1. '/' GET: No requirement for submit any data in any format
 * Server->Client: JSON object {user_id,name,phone,faculty,department,first_major,second_major,first_minor,second_minor}
 * 
 * 2. '/update' POST: POST body should have phone, second_major, first_minor, second_minor as compulsory part
 * Server->Client: Text message 'Fail' if server fail to handle your post and 'Success' if post successfully
 */

router.get('/', (req, res)=>{
    req.sql.query('SELECT * FROM info WHERE user_id = '+req.cookies.uid+';', (err, results, fields)=>{
        if (err) {
            console.log(err.messages);
            res.send('Failed')
        }
        else {
            res.json({
                user_id: results[0].user_id,
                name: results[0].name,
                phone: results[0].phone,
                faculty: results[0].faculty,
                department: results[0].department,
                first_major: results[0].first_major,
                second_major: results[0].second_major,
                first_minor: results[0].first_minor,
                second_minor: results[0].second_minor
            })
        }
    })
})

router.post('/update', (req, res)=>{
    req.sql.query('UPDATE info SET `phone` = '+req.body.phone+', `second_major` = '+req.body.second_major+', `first_minor` = '+req.body.first_minor+
    ', `second_minor` = '+req.body.second_minor+' WHERE `user_id` = '+req.cookies.uid+';', (err, results, fields)=>{
        if (err){
            console.log(err.messages);
            res.send('Update Failed');
        }
        else {
            res.send('Success');
        }
    })    
})


module.exports = router;