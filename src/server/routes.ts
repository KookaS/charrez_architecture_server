import cors from "cors";
import {generateID} from "@server/generatorID";
import {removeImage} from "@server/image";
import path from "path";
import {DocumentSchema} from "@schema/mongoSchema";
import bcrypt from "bcrypt";
import {
    mongoInsertProject,
    mongoFetchProject,
    mongoFetchAllCollections,
    mongoFetchAllDocuments, mongoRemoveCollection, mongoRemoveDocument
} from "@database/mongo";
import express from "express";
import HttpStatus from "http-status-codes"
import dotenv from "dotenv";
import {uploadFile} from "@database/upload"

dotenv.config();
const app = express();
app.use(express.json());

const corsOptions = {
    origin: process.env.API_URL_NEXT, //
}

// server init
export const serverStart = () => {
    app.options('*', cors(corsOptions)) // include before other routes
    app.listen(process.env.EXPRESS_PUBLIC_API_PORT, () => { // start listening on the port
        console.log(`⚡️[server]: Server is running at ${process.env.EXPRESS_PUBLIC_API_URL}:${process.env.EXPRESS_PUBLIC_API_PORT}`);
    });
}

// upload all collections
export const loadAllCollections = (dbName: string) => {
    app.get("/" + dbName + "/loadAllCollections", async (req, res) => {
        try {
            const collections = await mongoFetchAllCollections(dbName);
            const resMessage = {message: 'fetch successful', collections};
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Download problem!",
                error: err.message,
                path: dbName,
                id: req.query.id
            }
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}

// upload collection
export const loadProject = (dbName: string) => {
    app.get("/" + dbName + "/loadDocuments", async (req, res) => {
        try {
            const id = req.query.id;
            if (!id) throw new Error('Missing id in query');

            const documents: DocumentSchema[] = await mongoFetchAllDocuments(dbName, id.toString());
            const resMessage = {message: 'fetch successful', collection: id, documents};
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Download problem!",
                error: err.message,
                path: dbName,
                id: req.query.id
            }
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}


// download new collection
export const createProject = (dbName: string) => {
    app.post("/" + dbName + "/create", uploadFile(), async (req, res) => {
        try {
            if (!req.headers.authorization) throw new Error('No authorization!');

            let warning = undefined;
            if (!req.body.title || !req.body.description || !req.body.date) warning = "Missing element(s) in body of query";

            if (!req.file) warning = "No image in query";

            const id = req.file.filename;

            const metadata = {
                _id: id,
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
            }
            await mongoInsertProject(dbName, id, metadata);
            const resMessage = {message: 'creation successful', collection: id, metadata, warning};
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Upload problem!",
                error: err.message,
                path: dbName,
                body: req.body,
                id: req.file.filename
            }
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

// download new document
export const addToProject = (dbName: string) => {
    app.post("/" + dbName + "/addDocument", uploadFile(), async (req, res) => {
        try {
            if (!req.headers.authorization) throw new Error('No authorization!');

            const collection = req.query.collection;
            if (!collection) throw new Error('Missing id in query');

            let warning = undefined;
            if (!req.body.title) warning = "Missing title in body of query";

            if (!req.file) warning = "No image in query";

            const metadata = {
                _id: req.file.filename,
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
            }
            await mongoInsertProject(dbName, collection.toString(), metadata);
            const resMessage = {message: 'creation successful', collection, metadata, warning};
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Upload problem!",
                error: err.message,
                path: dbName,
                body: req.body,
                id: req.file.filename
            }
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

// upload information
export const loadProjectMetadata = (dbName: string) => {
    app.get("/" + dbName + "/loadMetadata", async (req, res) => {
        try {
            const id = req.query.id;
            if (!id) throw new Error('Missing id in query');

            const metadata = await mongoFetchProject(dbName, id.toString());
            const resMessage = {message: 'fetch successful', collection: id, metadata};
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Download problem!",
                error: err.message,
                path: dbName,
                id: req.query.id
            }
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}

// upload an image
export const loadImage = () => {
    app.get("/loadImage", async (req, res) => {
        try {
            const id = req.query.id;
            if (!id) throw new Error('Missing id in query');

            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.OK)
                .sendFile(path.join(__dirname, `${process.env.API_IMG}/` + id), (err) => {
                    if (err) throw err;
                });
        } catch (err) {
            const errorMessage = {
                message: "Download problem!",
                error: err.message,
                id: req.query.id
            }
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}

// removes a collection
export const removeCollection = (dbName: string) => {
    app.delete("/" + dbName + "/deleteCollection", uploadFile(), async (req, res) => {
        try {
            if (!req.headers.authorization) throw new Error('No authorization!');

            const collection = req.query.collection;
            if (!collection) throw new Error('Missing collection in query');

            const documents: DocumentSchema[] = await mongoFetchAllDocuments(dbName, collection.toString());
            documents.forEach((doc) => removeImage(doc._id));
            await mongoRemoveCollection(dbName, collection.toString());
            const resMessage = {message: 'removal successful', collection};
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Upload problem!",
                error: err.message,
                path: dbName,
                body: req.body,
                id: req.file.filename
            }
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

// removes a document
export const removeDocument = (dbName: string) => {
    app.delete("/" + dbName + "/deleteDocument", async (req, res) => {
        try {
            if (!req.headers.authorization) throw new Error('No authorization!');

            const collection = req.query.collection;
            if (!collection) throw new Error('Missing collection in query');

            const id = req.query.id;
            if (!id) throw new Error('Missing id in query');

            removeImage(id.toString());
            const doc = await mongoRemoveDocument(dbName, collection.toString(), id.toString());
            const resMessage = {message: 'removal successful', collection, id, doc};
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Upload problem!",
                error: err.message,
                path: dbName,
                body: req.body,
                id: req.file.filename
            }
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

// check if pw & user match environment values
export const authorization = () => {
    app.post("/account/auth", async (req, res) => {
        try {
            const hashPassword = await bcrypt.hash(req.body.password, `${process.env.API_SALT}`);
            let _id = undefined;
            let created_at = undefined;
            if (req.body.user == `${process.env.API_USER}` && hashPassword == `${process.env.API_HASH}`) {
                _id = generateID(5);
                created_at = Date.now();
            } else throw new Error('user or password do not match!');


            const resMessage = {_id, created_at};
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Login problem!",
                error: err.message,
            }
            res.header({"Access-Control-Allow-Origin": corsOptions.origin}).status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}