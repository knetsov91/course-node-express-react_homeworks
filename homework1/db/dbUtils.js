const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const database = "cooking";
const dbConn = dbConnection();
const userExists = (options) => {
    return new Promise((resolve, reject) => {
        findById({collection:"users", id: options.data}).then(data =>
            {
                console.log("userExists " + JSON.stringify(data))
                console.log("userExists " + data.length)
                 if(data.length === 1) {
                    resolve(data); 
                    
                 }  else {
                    reject([]) 
                 }
            })
             .catch(err => {
                console.log("error userExists()")
                reject(err)
             })
    });
} 

// const userExists = (id) => {
//     return new Promise((resolve, reject) =>{
//         findById({collection:"users", id}).then(data => {
//             if (data.length != 0) {
//                 resolve(data);
//                 }
//             else {
//                 reject(false)
//             }            
//         })
//         .catch(err => {
//             console.log("*/*/" + err)
//         })
//     });
    
// }
function dbConnection ()  {
    const url = "mongodb://localhost:27017/cooking";
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true } ,(err, d) => {
            if (err != null) {
                // console.log(err);
                reject(err);
            } else {
                console.log("Connected");
                resolve(d);
            }
        });
    });
}

const insert = (options) => {
    return new Promise((resolve, reject) => {
        dbConn.then( client => {
            let objectId = new ObjectID();
            const db = client.db(database);
           
            const createdAt = objectId.getTimestamp();
        
            console.log("ID  " + objectId);
            console.log("createdAt  " + createdAt);
            const data = Object.assign({}, options.data, {_id: objectId.toHexString(), createdAt})
            console.log("Insert data " + JSON.stringify(data))
            db.collection(options.collection).insertMany([data], {w:1}, function(err, d) {
                if (err != null) {
                    console.log("Insert data err " + d)
                    reject(err)
                } else {
                   
                    resolve(d);
                }
            });
        }).catch(err => console.log("- " + err))
    })
}

const findById = (options) => {
    return new Promise((resolve, reject) => {
        dbConn
        .then(client => {
            
            const db = client.db(database);
            console.log(`Id ${options.id}\t ObjectId ${ObjectID(options.id)}`)
         
            db.collection(options.collection)
            .find({"_id": options.id})
            .toArray((err, d) => {
                if(err != null) {
                    console.log("---")
                    reject(err);
                } else {
                    console.log("findById() -> resolved -> " + d)
                    resolve(d)
                }
            }) 

            // db.collection(options.collection).
            // findOne({"_id": options.id})
            // .then(d => {
            //     console.log(d)
            // })
            // .catch(e => {
            //     console.log("e "+  e )
            // })
          
        })
        .catch(err => {
            console.log("findById() error: " + err)
            reject(err);
        })
    })
}

const update = (options) => {
    return new Promise((resolve, reject) => {
        dbConn
        .then(client => {
            const db = client.db(database);
            const data = Object.assign({}, options.data, {updatedAt: ObjectID().getTimestamp() })
            db.collection(options.collection)
            .updateOne({_id: options.id}, {$set: data}, {w:1} , function(err, d) {
                if( err != null) {
                    reject(err);
                } else {
                    resolve(d);
                }
            });
        })
        .catch(err => {
            console.log("eer " + err)
        })
    });
}
const remove = (options) => {
    return new Promise((resolve, reject) => {
        dbConn
        .then(client => {
            const db = client.db(database);
            db.collection(options.collection).remove({"_id":  options.id}, {w:1}, function(err, d) {
                if (err != null)  {
                    reject(err);
                }
                else {
                    resolve(d)
                }
            })
        })
        .catch(err => {
            console.log("Error at remove() " + err)
            reject(err)
        })
    })
}

const select = (options) => {
    return new Promise((resolve, reject) => {
        dbConn.then(
            client => {
                const db = client.db(database);
                db.collection(options.collection)
                .find(options.cond)
                .toArray((err, items) => {
                    if (err != null) {
                        console.log('err from find() ')
                        reject(err);
                    } else {
                        console.log("FInd resolved")
                        resolve(items)
                    }
                });
               
            }
        ).catch(err => console.log("select" + err)) 
});
}
// const db = dbConnection();
// db.then(e=> console.log("OK"))
// .catch(err => console.log("err"));



const data =  {
            "name":  "tosho",
            "username": "Vili",
            "gender": "male",
            "role": "user",
            "description": "dada", 
            "createdAt": new Date()
        };
// insert({collection: "users", data})
// .then(d => {
//     console.log(d.ops[0]["_id"])
//     // console.log(d.ops[d.ops.length])
// })
// .catch(err => console.log(err))

// select({collection: "users"})
// .then(items => console.log(items))
// .catch(err => console.log(err))

module.exports = {
    insert,
    select,
    findById,
    remove,
    update,
    userExists
}

