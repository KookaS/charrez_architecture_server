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
export const mongoInsertProject = async (dbName: string, id:string, json: any) => {
    try {
        const db = MongoHelper.db(dbName);
        db.createCollection(id, (e) => {
            if (e) throw e;
        });
        await db.collection(id).insertOne(json);
        console.log(id + " metadata has been inserted well!")
    } catch (e) {
        console.error(id + " metadata unable to insert!")
        throw e;
    }
}

export const mongoFetchProject = async (dbName: string, id:string) => {
    try {
        const db = MongoHelper.db(dbName);
        return await db.collection(id).find({find_id: id}).sort({n: 1});
    }
    catch (e) {
        console.error(id + " metadata unable to fetch!")
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



