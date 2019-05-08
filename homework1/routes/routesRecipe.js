const express = require('express');
const dbUtil = require('../db/dbUtils');
const ObjectID = require("mongodb").ObjectID;
const router = express.Router();

router.get("/api/users/:id/recipe", (req, res) => {
    const id =req.params.id;
    dbUtil
    .userExists({collection: "users", data: id })
    .then(data => {  
        dbUtil
        .select({collection: "recipe", cond: {"user_id": ObjectID(id)}})
        .then(d => {            
            if( d.length !== 0){
                res.status(200).json(d)
            } else {
                res.status(404).json({msg: "user has no recipes"})
            }
        })
        .catch(e => {
            res.json(e)
            console.log(e)
        })
    }).catch(r =>{ 
        res.status(404).json({msg: "user not found"})
    })
 
});

router.post("/api/users/:id/recipe", (req, res) => {
    const userId = req.params.id;    
    const data = Object.assign({}, req.body, {"user_id": ObjectID(userId)})

    dbUtil
    .userExists({collection: "users", data: userId })
    .then(rez => {        
        dbUtil
        .insert({collection: "recipe", data})
        .then(d => {
            const id = d["insertedIds"]["0"];            
            res.set("Location", `/api/users/${userId}/recipe/${id}`)
            res.status(201).json({msg: `recipe ${id} inserted `})
        })
        .catch(rez => { 
            res.status(400).json({err: rez.errmsg })
        })
    })
    .catch(q => {
        console.log(q)
        res.status(404).json({msg: "No such user"});
    })
})

router.get("/api/users/:userId/recipe/:recipeId", (req, res) => {
    const id =req.params.userId;
    const recId = req.params.recipeId;
    dbUtil
    .userExists({collection: "users", data: id })
    .then(data => {
        dbUtil
        .select({collection: "recipe", cond: {"_id": recId}})
        .then(d => {         
            if (d.length === 0 ) {
                res.status(404).json({msg: "no such recipe"})
            } else {
                res.status(200).json(d)
            }            
        })
        .catch(er => {
            res.status(404).json({msg: "no such recipe"})
            console.log("Error "  +er)
        })
    })
    .catch(e => {
        
        res.status(404).json({msg: "No such user"});
    })

});

router.delete("/api/users/:userId/recipe/:recipeId", (req, res) => {
    const id =req.params.userId;
    const recId = req.params.recipeId;
    dbUtil
    .userExists({collection: "users", data: id })
    .then(data => {
        dbUtil
        .select({collection: "recipe", cond:{"_id": recId}})
        .then(rez => {
            if (rez.length === 0) {
                res.status(404).json({msg: "recipe not found"})
            } else {
                dbUtil
                .remove({collection: "recipe", id: recId})
                .then(rez => {
                    res.status(201).json({})
                })
                .catch(err => {
                    res.status(404).json({msg: "recipe not found"});                    
                })
            }
        })
        .catch(a => {
            res.status(404).json({msg: "recipe not found"})
        })
        
    })
    .catch(err => {
        res.status(404).json({msg: "No such user"});
    })
})


router.put("/api/users/:userId/recipe/:recipeId", (req, res) => {
    const id =req.params.userId;
    const recId = req.params.recipeId;

    dbUtil.userExists({collection: "users", data: id }).then(d => {
        dbUtil
        .select({collection: "recipe", cond: {"_id": recId}})
        .then(d => {
            if (d.length === 0) {
                res.status(404).json({msg: "no such recipe"})
            } else {
                dbUtil
                .update({collection: 'recipe',  id: recId, data: req.body})
                .then(rez => {
                    // if(rez.nModified === 1)
                    // {   
                    //     res.status(200).json({msg: `updated`})
                    // } else {
                    //     res.status(404).json({msg: `nothing to update`})
                    // }
                    
                    res.json(rez);
                })
                .catch(err => {
                    res.status(400).json({msg: err.errmsg});
                    console.log("err from put /users/:id " + err)
                })
            }
            
        })
        .catch(er => {
            res.status(404).json({msg: "no such recipe"})
            console.log("Error "  +er)
        })
    })
    .catch(e => {        
        res.status(404).json({msg: "No such user"});
    })
});
module.exports = router;