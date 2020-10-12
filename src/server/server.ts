import express from "express";
import {Server} from "http";
import HttpStatus from "http-status-codes"
import {uploadFile, updateMetadata} from "@database/upload"
import {mongoConnect, mongoClose, mongoFetchImage} from "@database/mongo";

const app = express();
const PORT = 8080;
let server: Server;
let listID: string[] = [];
const shell = require('shelljs');

export const serverInit = () => {
    shell.exec('./reset-port.sh');
    serverStart();
    createProject("villas", "villas");
    createProject("immeubles", "immeubles");
    createProject("urbanisme", "urbanisme");
    loadProject("villas", "villas");
    //loadProject("immeubles", "immeubles");
    //loadProject("urbanisme", "urbanisme");
}

/// restart the server
const resetConnection = () => {
        server.close();
        serverStart();
}

/// start listening on the port
const serverStart = () => {
    server = app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    });
}

/// random ID generator
const makeID = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for (const element of listID) {
        if (result == element) {
            result = makeID(length);
            break;
        }
    }
    return result;
}

/// send in body title, description and date for new
// example to upload values to db
// await mongoInsertProject(projectType, req.file.id, imageTitle, imageDescription, imageDate);
const createProject = (projectType: string, dbName: string) => {
    app.post("/" + projectType + "/create", uploadFile(dbName), async (req, res) => {
        try {
            let warning = undefined;
            if (!req.body.title || !req.body.description || !req.body.date) {
                warning = "Missing element(s) in body of query";
            }
            const metadata = {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date
            }
            updateMetadata(metadata); //Static test value
            console.log(req.file.id)

            const resMessage = {message: 'creation successful', id: req.file.id, metadata: metadata, warning};
            res.status(HttpStatus.OK).send(resMessage);
            await resetConnection();
        } catch (e) {
            const errorMessage = {
                message: "File has not been uploaded!",
                error: e.message,
                projectType,
                body: req.body,
                id: req.file.id
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

const loadProject = (projectType: string, dbName: string) => {
    app.get("/" + projectType + "/load", async (req, res) => {
        try {
            const id = req.query.id;
            console.log()
            if (!id) {
                throw new Error('Missing id in in params of query');
            }
            let files = await mongoFetchImage(dbName, id.toString());
            console.log("after sending")
            const resMessage = {message: 'Load successful', id, files};
            res.status(HttpStatus.OK).send(resMessage);
            console.log("before resetConnection")
            resetConnection();
        } catch (e) {
            const errorMessage = {
                message: "Error when fetching the project",
                error: e,
                projectType,
                id: req.query.id
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}