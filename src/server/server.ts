import express from "express";
import {Server} from "http";
import HttpStatus from "http-status-codes"
import {uploadFile} from "@database/upload"
import {
    mongoConnect,
    mongoInsertProject,
    mongoFetchProject,
    mongoFetchAllCollections,
    mongoFetchAllDocuments
} from "@database/mongo";
import path from "path";

const app = express();
const PORT = 8080;
let server: Server;

export const serverInit = () => {
    try {
        serverStart();
        mongoConnect();

        createProject("villas");
        loadProjectMetadata("villas");
        loadImage("villas");
        loadCollections("villas");
        addToProject("villas");
        loadProject("villas");

        createProject("immeubles");
        loadProjectMetadata("immeubles");
        loadImage("immeubles");

        createProject("urbanisme");
        loadProjectMetadata("urbanisme");
        loadImage("urbanisme");
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

const loadCollections = (dbName: string) => {
    app.get("/" + dbName + "/loadCollections", async (req, res) => {
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
            const documents = await mongoFetchAllDocuments(dbName, id.toString());
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

const loadImage = (dbName: string) => {
    app.get("/" + dbName + "/loadImage", async (req, res) => {
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
                path: dbName,
                id: req.query.id
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}