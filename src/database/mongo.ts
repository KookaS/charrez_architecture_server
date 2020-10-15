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
export const mongoInsertProject = async (dbName: string, id: string, json: any) => {
    try {
        const db = MongoHelper.db(dbName);
        db.createCollection(id, (err) => {
            if (err) throw err;
        });
        await db.collection(id).insertOne(json);
        console.log("new id: " + id + " metadata has been inserted well!")
    } catch (err) {
        console.error("new id: " + id + " metadata unable to insert!")
        throw err;
    }
}

export const mongoFetchProject = async (dbName: string, id: string) => {
    return new Promise(async (resolve, reject) => {
        await MongoHelper.db(dbName).collection(id).findOne({}, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    })
}



