import {MongoHelper} from "@database/helper"

// create a new project in the db
export const mongoInsertProject = async (dbName: string, projectType: string, json:any) => {
    await mongoConnect();
    const collection = MongoHelper.db(dbName).collection(projectType);
    try {
        await collection.insertOne(json);
        console.log(json.id + " has been inserted well!")
    } catch (e) {
        console.error("Unable to insert project: " + e)
    }
    mongoClose();
}

// connect mongodb to the right port
const mongoConnect = async () => {
    try {
        await MongoHelper.connect();
        console.log(`Connected to Mongo!`);
    } catch (err) {
        console.error(`Unable to connect to Mongo!`, err);
    }
}

// closes the connection to mongodb
const mongoClose = () => {
    try {
        MongoHelper.disconnect();
        console.log(`Closed Mongo!`);
    } catch (err) {
        console.error(`Unable to connect to Mongo!`, err);
    }
}



