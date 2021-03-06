import {MongoHelper} from "@database/helper"
import {DocumentSchema} from "@schema/mongoSchema";

// connect mongodb to the right port
export const mongoConnect = async () => {
    try {
        await MongoHelper.connect()
    } catch (err) {
        throw err;
    }
}

// closes the connection to mongodb
export const mongoClose = () => {
    try {
        MongoHelper.disconnect();
    } catch (err) {
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

// collect document into collection
export const mongoFetchProject = async (dbName: string, id: string) => {
    return new Promise(async (resolve, reject) => {
        MongoHelper.db(dbName).collection(id).findOne({_id: id}, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    })
}

//collect all collections
export const mongoFetchAllCollections = async (dbName: string) => {
    return new Promise(async (resolve, reject) => {
        MongoHelper.db(dbName).listCollections({}, {nameOnly: true}).toArray((err, res) => {
            if (err) reject(err);
            else resolve(res);
        })
    })
}

// collect all documents into collection
export const mongoFetchAllDocuments = async (dbName: string, collection: string): Promise<DocumentSchema[]> => {
    return new Promise(async (resolve, reject) => {
        MongoHelper.db(dbName).collection(collection).find().toArray((err, res: DocumentSchema[])=>{
            if (err) reject(err);
            else resolve(res);
        })
    })
}

// delete a collection
export const mongoRemoveCollection = async (dbName: string, collection: string) => {
    return new Promise(async (resolve, reject) => {
        MongoHelper.db(dbName).collection(collection).drop((err, res)=>{
            if (err) reject(err);
            else resolve(res);
        })
    })
}

// delete a document into collection
export const mongoRemoveDocument = async (dbName: string, collection: string, id: string) => {
    return new Promise(async (resolve, reject) => {
        MongoHelper.db(dbName).collection(collection).deleteOne({_id: id}, (err, res)=>{
            if (err) reject(err);
            else resolve(res);
        })
    })
}



