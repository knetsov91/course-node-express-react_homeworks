const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const database = "cooking";
const dbConn = dbConnection();

const userExists = (options) => {
    return new Promise((resolve, reject) => {
        findById({collection:"users", id: options.data}).then(data =>
            {                
                 if(data.length === 1) 
                 {
                    resolve(data);                     
                 }  else {
                    reject([]) 
                 }
            })
             .catch(err => {              
                reject(err)
             })
    });
} 

function dbConnection ()  {
    const url = "mongodb://localhost:27017/cooking";
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true } ,(err, d) => {
            if (err != null) {                
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
            const data = Object.assign({}, options.data, {_id: objectId.toHexString(), createdAt});           
            db.collection(options.collection).insert(data, {w:1}, function(err, d) {
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
            db.collection(options.collection)
            .find({"_id": options.id})
            .toArray((err, d) => {
                if(err != null) {                    
                    reject(err);
                } else {                    
                    resolve(d)
                }
            })           
        })
        .catch(err => {            
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
            db
            .collection(options.collection)
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
            db
            .collection(options.collection)
            .remove({"_id":  options.id}, {w:1}, function(err, d) {
                if (err != null)  {
                    reject(err);
                }
                else {
                    resolve(d);
                }
            })
        })
        .catch(err => {           
            reject(err);
        })
    })
}

const select = (options) => {
    return new Promise((resolve, reject) => {
        dbConn
        .then(
            client => {
                const db = client.db(database);
                db
                .collection(options.collection)
                .find(options.cond)
                .toArray((err, items) => {
                    if (err != null) {                        
                        reject(err);
                    } else {                        
                        resolve(items)
                    }
                });               
            }
        ).catch(err => console.log("select() error" + err)) 
});
}

module.exports = {
    insert,
    select,
    findById,
    remove,
    update,
    userExists
}

