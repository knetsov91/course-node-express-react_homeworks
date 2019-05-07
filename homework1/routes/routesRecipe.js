const express = require('express');
const dbUtil = require('../db/dbUtils');
const ObjectID = require("mongodb").ObjectID;
const router = express.Router();

// const userExists = (options) => {
//     return new Promise((resolve, reject) => {
//         dbUtil.findById({collection:"users", id: options.data}).then(data =>
//             {
//                 console.log("userExists " + JSON.stringify(data))
//                 console.log("userExists " + data.length)
//                  if(data.length === 1) {
//                     resolve(data); 
                    
//                  }  else {
//                     reject([]) 
//                  }
//             })
//              .catch(err => {
//                 console.log("error userExists()")
//              })
//     });
// } 
router.get("/api/users/:id/recipe", (req, res) => {
//     dbUtil.findById({collection: "users", id: req.params.id}).then(data =>
//    {
//         console.log(data.length)
//         res.json(data)}
//     )
//     .catch(err => {
       
//     })
    const id =req.params.id;
    dbUtil.userExists({collection: "users", data: id }).then(data => {
        // res.json({msg: data})
        console.log("get :id/recipe " + data)
    
        dbUtil.select({collection: "recipe", cond: {"user_id": ObjectID(id)}})
        .then(d => {
            console.log("select recipe  " +  JSON.stringify(d))
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
    // dbUtil.select({ collection: "recipe"})
    // .then(data => res.status(200).json(data))
    // .catch(err => res.status(400).json(err))
});

router.post("/api/users/:id/recipe", (req, res) => {
    const userId = req.params.id;
    console.log(req.body)
    const data = Object.assign({}, req.body, {"user_id": ObjectID(userId)})
    console.log(data)
    console.log("ObjectID " + ObjectID(req.params.id))
    dbUtil.insert({collection: "recipe", data})
    .then(d => {
        const id = d["insertedIds"]["0"];
        console.log(d)
        res.set("Location", `/api/users/${userId}/recipe/${id}`)
        res.status(201).json({msg: `recipe ${id} inserted `})
    })
    .catch(rez => {
        console.log(data)
        console.log("--" + rez)
        res.status(401).json(rez)
    })
})

router.get("/api/users/:userId/recipe/:recipeId", (req, res) => {
    const id =req.params.userId;
    const recId = req.params.recipeId;
    dbUtil.userExists({collection: "users", data: id }).then(data => {
        dbUtil.select({collection: "recipe", cond: {"_id": recId}})
        .then(d => {
            console.log("???  ",JSON.stringify(d))
            if (d.length === 0 ) {
                res.status(404).json({msg: "no such recipe"})
            } else {
                res.status(200).json(d)
            }
            
        })
        .catch(er => {
            res.status(404).json({msg: "no such recipe"})
            console.log("&&& "  +er)
        })
    })
    .catch(e => {
        
        res.status(404).json({msg: "No such user"});
    })

});

router.delete("/api/users/:userId/recipe/:recipeId", (req, res) => {
    const id =req.params.userId;
    const recId = req.params.recipeId;
    dbUtil.userExists({collection: "users", data: id })
    .then(data => {

        dbUtil.select({collection: "recipe", id: recId})
        .then(rez => {
            dbUtil.remove({collection: "recipe", id: recId})
            .then(rez => {

                res.status(201).json({})
            })
            .catch(err => {
                res.status(404).json({msg: "recipe not found"})
                // res.send(err)
            })
        })
        .catch(a =>{
            res.status(404).json({msg: "recipe not found"})
        })
        
    })
    .catch(err => {
        res.status(404).json({msg: "No such user"});
    })
})

module.exports = router;