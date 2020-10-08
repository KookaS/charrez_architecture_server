import mongodb from "mongodb";

const dbName = "charrez_architecture";
const url = "mongodb://localhost:27017/" + dbName;

export const mongoCreate = () => {
    let MongoClient = mongodb.MongoClient;

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err: Error, db: any) => {
        if (err) throw err;
        console.log("Database created!");
        db.collection
        db.close();
    });
}

export const mongoFind = () => {
    let MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(url, (err: Error, db: typeof MongoClient) => {
        if (err) throw err;

        // db.collection('mammals').find().toArray(function(err, result){
        //      if(err) throw err;
        //      console.log(result);
        //      client.close();
        //    });

        db.close();
    });
}