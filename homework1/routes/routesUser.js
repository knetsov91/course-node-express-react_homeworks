const express = require('express');
const app = express();
const router = express.Router();
const insertAPI = require('../app1').insertPromisify;
const dbUtil = require("../db/dbUtils");

router.post("/", (req, res) => {
    // insertPromisify(req.body)
    // .then(e => {
    //     console.log(e)
    //     // res.set("Location")q
    //     res.status(201).json({msg: "ok!"})
    // })
    // .catch(er)
    // res.json(req.body)

    // const data = {
    //     ...req.body,
    //     createdAt: new Date()
    // };

    // data = Object.assign({}, req.body, {createdAt: new Date()})

    // console.log(data)
    dbUtil.insert({collection: "users", data:  req.body})
    .then((rez) => {
        const id = rez["insertedIds"]["0"];    
        console.log("id " + id);  
      console.log(rez);
      res.setHeader("Location", `/api/users/${id}`)
      res.status(201).json({msg: `Id ${rez["insertedIds"]["0"]} inserted`});
    }).catch((err) => {
        console.log("--"+ err)
        res.status(400).json({err: err.errmsg })
    });
    
});

router.put("/:id", (req, res) => {
    
    dbUtil.update({collection: 'users',  id: req.params.id, data: req.body})
    .then(rez => {
        // if(rez.nModified === 1)
        // {   
        //     res.status(200).json({msg: `updated`})
        // } else {
        //     res.status(404).json({msg: `nothing to update`})
        // }
        console.log("== " + rez.nModified)
        res.json(rez);
    })
    .catch(err => {
        console.log("err from put /users/:id " + err)
    })
})
router.delete("/:id", (req, res) => {
    // dbUtil.findById({collection: "users", id: req.params.id})
    // .then(data=> {
    //     if (data.length == 0) {
    //         res.status(404).json({msg: "User not found"})
    //     }
    // })
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
    dbUtil.select({collection: "users"})
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
    // todo: id input validation
    // dbUtil.userExists(req.params.id).then( d=> {
    //     console.log("exists " + d)
    //     res.status(200).json({"da" : d})
    // }).catch(e => {
    //     console.log("err " + e)
    //     res.status(404).json({msg: "user not found"})
    // })
    
    dbUtil.findById({collection: "users", id: req.params.id})
    .then(data => {
  
        console.log("Data " + data)
        if (data.length == 0 ) {
            res.status(404).json({msg: "user not found"})
        }else {
            res.status(200).json(data[0])
        }
    })
    .catch(err => {
        res.status(404).json({msg: "user not found"})
        console.log(`Error from route /users/:id: ${err}`)
    })
});

module.exports = router