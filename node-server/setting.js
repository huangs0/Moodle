/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */
import express from 'express';
let router = express.Router();

router.get('/', (req, res)=>{d
    req.sql.query(`SELECT * FROM info WHERE user_id = '${req.cookies.uid}';`, (err, results, fields)=>{
        if (err) {
            console.log(err.messages);
            res.json({
                status:true,
                error: 'Fail to select from database'
            })
        }
        else {
            res.json({
                status: true,
                info: {
                user_id: results[0].user_id,
                name: results[0].name,
                phone: results[0].phone,
                faculty: results[0].faculty,
                department: results[0].department,
                first_major: results[0].first_major,
                second_major: results[0].second_major,
                first_minor: results[0].first_minor,
                second_minor: results[0].second_minor
                }
            })
        }
    })
})

router.post('/', (req, res)=>{
    req.sql.query(`UPDATE info SET phone = '${req.body.phone}', second_major = '${req.body.second_major}', first_minor = '${req.body.first_minor}', second_minor = '${req.body.second_minor}' WHERE user_id = '${req.cookies.uid}';`, (err, results, fields)=>{
        if (err){
            console.log(err.messages);
            res.json({
                status:false,
                error:'Fail to update in database'
            });
        }
        else {
            res.json({
                status:true
            });
        }
    })    
})


module.exports = router;
