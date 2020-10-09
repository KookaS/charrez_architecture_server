import mongodb from "mongodb";

const dbName = "charrez_architecture";
const url = "mongodb://localhost:27017/" + dbName;

export const mongoCreate = () => {
    let MongoClient = mongodb.MongoClient;

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err: Error, db: any) => {
        if (err) console.log(Error('DB cannot open'));
        console.log("Database created!");
        db.collection
        db.close();
    });
}

