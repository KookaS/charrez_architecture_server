import express from "express";
import {Server} from "http";
import HttpStatus from "http-status-codes"
import {uploadFile} from "@database/upload"
import {mongoConnect, mongoInsertProject, mongoFetchProject} from "@database/mongo";
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
        loadProjectImage("villas");

        createProject("immeubles");
        loadProjectMetadata("immeubles");
        loadProjectImage("immeubles");

        createProject("urbanisme");
        loadProjectMetadata("urbanisme");
        loadProjectImage("urbanisme");
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

// random ID generator
const makeID = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    //maybe check existence of similar id
    return result;
}

// send in body title, description and date for new
const createProject = (dbName: string) => {
    app.post("/" + dbName + "/create", uploadFile(makeID(20)), async (req, res) => {
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
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
            }
            await mongoInsertProject(dbName, id, metadata);
            const resMessage = {message: 'creation successful', id, metadata, warning};
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
            const resMessage = {message: 'fetch successful', id, metadata};
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

const loadProjectImage = (dbName: string) => {
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