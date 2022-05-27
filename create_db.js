var MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017";

//Create a database named "mydb":
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});