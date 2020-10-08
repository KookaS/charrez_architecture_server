import {Mongoose} from "mongoose";

const dbName = "charrez_architecture";
const url = "mongodb://localhost:27017/"+dbName;
console.log(url)

export const mongoCreate = () => {
    let MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(url, (err: Error, db: any) => {
        if (err) throw err;
        console.log("Database created!");
        db.collection
        db.close();
    });
}

export const mongoFind = () => {
    let MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(url, (err: Error, db: any) => {
        if (err) throw err;

        // db.collection('mammals').find().toArray(function(err, result){
        //      if(err) throw err;
        //      console.log(result);
        //      client.close();
        //    });

        db.close();
    });
}