import express from "express";
import {Server} from "http";
import HttpStatus from "http-status-codes"
import {uploadFile} from "@database/upload"
import {
    mongoConnect,
    mongoInsertProject,
    mongoFetchProject,
    mongoFetchAllCollections,
    mongoFetchAllDocuments, mongoRemoveCollection, mongoRemoveDocument
} from "@database/mongo";
import path from "path";
import fs from "fs";
import {DocumentSchema} from "@schema/mongoSchema";

const app = express();
const PORT = 8080;
let server: Server;

export const serverInit = () => {
    try {
        serverStart();
        mongoConnect();
        loadImage();

        createProject("acceuil");
        loadAllCollections("acceuil");
        removeCollection("acceuil");

        createProject("villas");
        loadProjectMetadata("villas");
        loadAllCollections("villas");
        addToProject("villas");
        loadProject("villas");
        removeCollection("villas");
        removeDocument("villas");

        createProject("immeubles");
        loadProjectMetadata("immeubles");
        loadAllCollections("immeubles");
        addToProject("immeubles");
        loadProject("immeubles");
        removeCollection("immeubles");
        removeDocument("immeubles");

        createProject("urbanisme");
        loadProjectMetadata("urbanisme");
        loadAllCollections("urbanisme");
        addToProject("urbanisme");
        loadProject("urbanisme");
        removeCollection("urbanisme");
        removeDocument("urbanisme");
    } catch (err) {
        console.log(err)
    }
}

// start listening on the port
const serverStart = () => {
    server = app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    });
}

const loadAllCollections = (dbName: string) => {
    app.get("/" + dbName + "/loadAllCollections", async (req, res) => {
        try {
            const collections = await mongoFetchAllCollections(dbName);
            const resMessage = {message: 'fetch successful', collections};
            res.status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Download problem!",
                error: err.message,
                path: dbName,
                id: req.query.id
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}
const loadProject = (dbName: string) => {
    app.get("/" + dbName + "/loadDocuments", async (req, res) => {
        try {
            const id = req.query.id;
            if (!id) {
                throw new Error('Missing id in query');
            }
            const documents: DocumentSchema[] = await mongoFetchAllDocuments(dbName, id.toString());
            const resMessage = {message: 'fetch successful', collection: id, documents};
            res.status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Download problem!",
                error: err.message,
                path: dbName,
                id: req.query.id
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}


// send in body title, description and date for new
const createProject = (dbName: string) => {
    app.post("/" + dbName + "/create", uploadFile(), async (req, res) => {
        try {
            let warning = undefined;
            if (!req.body.title || !req.body.description || !req.body.date) {
                warning = "Missing element(s) in body of query";
            }
            if (!req.file) {
                warning = "No image in query";
            }
            const id = req.file.filename;

            const metadata = {
                _id: id,
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
            }
            await mongoInsertProject(dbName, id, metadata);
            const resMessage = {message: 'creation successful', collection: id, metadata, warning};
            res.status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Upload problem!",
                error: err.message,
                path: dbName,
                body: req.body,
                id: req.file.filename
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

const addToProject = (dbName: string) => {
    app.post("/" + dbName + "/addToProject", uploadFile(), async (req, res) => {
        try {
            const id = req.query.id;
            if (!id) {
                throw new Error('Missing id in query');
            }

            let warning = undefined;
            if (!req.body.title) {
                warning = "Missing title in body of query";
            }
            if (!req.file) {
                warning = "No image in query";
            }

            const metadata = {
                _id: req.file.filename,
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
            }
            await mongoInsertProject(dbName, id.toString(), metadata);
            const resMessage = {message: 'creation successful', collection: id, metadata, warning};
            res.status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Upload problem!",
                error: err.message,
                path: dbName,
                body: req.body,
                id: req.file.filename
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

const loadProjectMetadata = (dbName: string) => {
    app.get("/" + dbName + "/loadMetadata", async (req, res) => {
        try {
            const id = req.query.id;
            if (!id) {
                throw new Error('Missing id in query');
            }
            const metadata = await mongoFetchProject(dbName, id.toString());
            const resMessage = {message: 'fetch successful', collection: id, metadata};
            res.status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Download problem!",
                error: err.message,
                path: dbName,
                id: req.query.id
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}

const loadImage = () => {
    app.get("/loadImage", async (req, res) => {
        try {
            const id = req.query.id;
            if (!id) {
                throw new Error('Missing id in query');
            }
            res.status(HttpStatus.OK).sendFile(path.join(__dirname, '../../uploads/' + id), (err) => {
                if (err) throw err;
            });
        } catch (err) {
            const errorMessage = {
                message: "Download problem!",
                error: err.message,
                id: req.query.id
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}

const removeCollection = (dbName: string) => {
    app.delete("/" + dbName + "/deleteCollection", uploadFile(), async (req, res) => {
        try {
            const collection = req.query.collection;
            if (!collection) {
                throw new Error('Missing collection in query');
            }
            const documents: DocumentSchema[] = await mongoFetchAllDocuments(dbName, collection.toString());
            documents.forEach((doc) => removeImage(doc._id));
            await mongoRemoveCollection(dbName, collection.toString());
            const resMessage = {message: 'removal successful', collection};
            res.status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Upload problem!",
                error: err.message,
                path: dbName,
                body: req.body,
                id: req.file.filename
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

const removeDocument = (dbName: string) => {
    app.delete("/" + dbName + "/deleteDocument", uploadFile(), async (req, res) => {
        try {
            const collection = req.query.collection;
            if (!collection) {
                throw new Error('Missing collection in query');
            }
            const id = req.query.id;
            if (!id) {
                throw new Error('Missing id in query');
            }
            removeImage(id.toString());
            const doc = await mongoRemoveDocument(dbName, collection.toString(), id.toString());
            const resMessage = {message: 'removal successful', collection, id, doc};
            res.status(HttpStatus.OK).send(resMessage);
        } catch (err) {
            const errorMessage = {
                message: "Upload problem!",
                error: err.message,
                path: dbName,
                body: req.body,
                id: req.file.filename
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

const removeImage = (id: string) => {
    const path = `./uploads/${id}`;

    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}