import {MongoHelper} from "@database/helper"

// connect mongodb to the right port
export const mongoConnect = async () => {
    try {
        await MongoHelper.connect();
        console.log(`Connected to Mongo!`);
    } catch (e) {
        console.error(`Unable to connect to Mongo!`);
        throw e;
    }
}

// closes the connection to mongodb
export const mongoClose = () => {
    try {
        MongoHelper.disconnect();
        console.log(`Closed Mongo!`);
    } catch (e) {
        console.error(`Unable to close to Mongo!`);
        throw e;
    }
}

// create a new project in the db
export const mongoInsertProject = async (dbName: string, id: string, json: any) => {
    await mongoConnect();
    const collection = MongoHelper.db(dbName).collection(id);
    try {
        await collection.insertOne(json);
        console.log(json.id + " has been inserted well!")
        await mongoClose();
    } catch (e) {
        console.error("Unable to insert project: ")
        throw e;
    }
}

// fetch project in db
export const mongoFetchImage = async (dbName: string, id: string) => {
    try {
        await mongoConnect();
        const db = MongoHelper.db(dbName);
        const collection = db.collection('fs.chunks');
        await collection.find({find_id: id}).sort({n: 1}).toArray((err, files) => {
            if (err) throw err;
            if (!files[0] || files.length === 0) {
                // throw new Error('Files metadata empty');
            }
            console.log("files[0]: " + files[0]);
            console.log("files[1]: " + files[1]);

            files.map(file => {
                file.isImage = file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/svg+xml';
            })

            console.log("before returning")
            mongoClose();
            return files;
        })

        //console.log("resFiles: " + resFiles.toArray())
    } catch (e) {
        await mongoClose();
        throw e;
    }
}



