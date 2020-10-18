import {MongoHelper} from "@database/helper"

// connect mongodb to the right port
export const mongoConnect = () => {
    MongoHelper.connect().then(() => {
        console.log(`Connected to Mongo!`)
    }).catch((err) => {
        console.error(`Unable to connect to Mongo!`, err)
    });
}

// closes the connection to mongodb
export const mongoClose = () => {
    try {
        MongoHelper.disconnect();
        console.log(`Closed Mongo!`);
    } catch (err) {
        console.error(`Unable to close to Mongo!`);
        throw err;
    }
}

// create a new project in the db
export const mongoInsertProject = async (dbName: string, collection: string, json: any) => {
    try {
        const db = MongoHelper.db(dbName);
        await db.collection(collection).insertOne(json);
        console.log("In collection: " + collection + " metadata has been inserted well!")
    } catch (err) {
        console.error("In collection: " + collection + " metadata unable to insert!")
        throw err;
    }
}

export const mongoFetchProject = async (dbName: string, id: string) => {
    return new Promise(async (resolve, reject) => {
        MongoHelper.db(dbName).collection(id).findOne({_id: id}, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    })
}

export const mongoFetchAllCollections = async (dbName: string) => {
    return new Promise(async (resolve, reject) => {
        MongoHelper.db(dbName).listCollections({}, {nameOnly: true}).toArray((err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    })
}

export const mongoFetchAllDocuments = async (dbName: string, collection: string) => {
    return new Promise(async (resolve, reject) => {
        MongoHelper.db(dbName).collection(collection).find().toArray((err, res)=>{
            if (err) reject(err);
            else resolve(res);
        })
    })
}



