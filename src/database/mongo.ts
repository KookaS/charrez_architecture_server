import {MongoHelper} from "@database/helper"

// create a new project in the db
export const mongoInsertProject = async (projectType: string, id: string, title: string, description: string, date: string) => {
    await mongoConnect();
    const collection = MongoHelper.db().collection(projectType);
    const document = {id, title, description, date};
    try {
        await collection.insertOne(document);
        console.log(id + " has been inserted well!")
    } catch (e) {
        console.error("Unable to insert project: " + e)
    }
    mongoClose();
}

const mongoConnect = async () => {
    try {
        await MongoHelper.connect();
        console.log(`Connected to Mongo!`);
    } catch (err) {
        console.error(`Unable to connect to Mongo!`, err);
    }
}

const mongoClose = () => {
    try {
        MongoHelper.disconnect();
        console.log(`Closed Mongo!`);
    } catch (err) {
        console.error(`Unable to connect to Mongo!`, err);
    }
}



