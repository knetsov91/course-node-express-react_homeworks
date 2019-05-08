const express = require('express');
const app = express();
const router = express.Router();
const dbUtil = require("../db/dbUtils");

router.post("/", (req, res) => {   
    dbUtil
    .insert({collection: "users", data:  req.body})
    .then((rez) => {
      const id = rez["insertedIds"]["0"];       
      res.setHeader("Location", `/api/users/${id}`)
      res.status(201).json({msg: `Id ${rez["insertedIds"]["0"]} inserted`});
    }).catch((err) => {
        console.log(err)
        res.status(400).json({err: err.errmsg })
    });
    
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    dbUtil
    .userExists({collection: "users", data: id })
    .then(d =>{
        dbUtil
        .update({collection: 'users',  id: req.params.id, data: req.body})
        .then(rez => {       
            res.json(rez);
        })
        .catch(err => {
            res.status(404).json({msg: "No such user"});
            console.log("err   " + err)
        })
    })
    .catch(q => {
        res.status(404).json({msg: "No such user"});
    })
})
router.delete("/:id", (req, res) => {  
    const id = req.params.id ;
    dbUtil
    .userExists({collection: "users", data: id })
    .then(d =>{
        dbUtil
        .remove({collection: "users", id})
        .then(data => {
            console.log(data.result)
            console.log(data.result.n)
            if (data.result.n) {
                res.status(204).json({})
            } else if(data.result.n ){
                res.status(404).json({msg: `${id} not found`})
            }
            
        })
        .catch(err => {
            res.json(data)
        })
    })
    .catch(e => {
        res.status(404).json({msg: "No such user"});
    })
})

router.get("/", (req, res) => {
    dbUtil
    .select({collection: "users"})
    .then(data => {
        if(data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(200).json({msg: " no users"})
        }
    })
    .catch(err => {
        res.status(400).json(err);
    })
});

router.get("/:id", (req, res) => {    
    dbUtil
    .findById({collection: "users", id: req.params.id})
    .then(data => {  
        
        if (data.length == 0 ) {
            res.status(404).json({msg: "user not found"})
        }else {
            res.status(200).json(data[0])
        }
    })
    .catch(err => {
        res.status(404).json({msg: "user not found"})
        console.log(`Error  ${err}`)
    })
});

module.exports = router