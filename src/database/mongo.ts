import mongodb from "mongodb";

const dbName = "charrez_architecture";
const url = "mongodb://localhost:27017/" + dbName;

export const mongoInit = async() => {
    let MongoClient = mongodb.MongoClient;

    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err: Error, db) => {
        if (err) console.log(Error('DB cannot open'));
        console.log("Database created!");
        db.close();
    });
}

export const mongoCreate = async () => {
    let MongoClient = mongodb.MongoClient;

    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err: Error, db: any) => {
        if (err) {
            console.log(Error('DB cannot open'));
            return err
        }
        db.collection();
        db.close();
    });
}

