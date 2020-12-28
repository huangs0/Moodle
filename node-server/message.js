let express = require('express');
let router = express.Router();

// More details in message is still under develop process

/**
 * Protocol for request under this router
 * 1. '/' GET: 
 * Server->Client: JSON Array with each entry has {message_id, title, content} three attribute
 * 2. '/:message_id' DELETE: message_id should provide in url
 * Server->Client: Text Message 'Success' if server successully delete message or 'Fail' if fail to
 */

router.get('/',(req, res)=>{
    req.sql.query('SELECT `message_id`, `title`, `content` FROM `message` WHERE `user_id` = '+req.cookies.uid+';', (err,results,fields)=>{
        if (err) {
            console.log(err.messages);
            res.json(['Fail']);
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
            res.json(res_json);
        }
    })
})

router.delete('/:message_id',(req,res)=>{
    req.sql.query('DELETE FROM `message` WHERE `message_id` = '+req.params.message_id+';', (err, results, fields)=>{
        if (err) {
            console.log(err.messages);
            res.send('Fail');
        }
        else {
            res.send('Success');
        }
    })
})

module.exports = router;