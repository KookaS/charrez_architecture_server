import express from "express";
import {Server} from "http";
import HttpStatus from "http-status-codes"
import {uploadFile} from "@database/upload"
import {mongoConnect, mongoInsertProject, mongoFetchProject} from "@database/mongo";
import path from "path";

const app = express();
const PORT = 8080;
let server: Server;
let listID: string[] = [];

export const serverInit = () => {
    try {
        serverStart();
        mongoConnect();
        createProject("villas");
        createProject("immeubles");
        createProject("urbanisme");
        loadProject("villas");
    }
    catch (e) {
        console.log(e)
    }

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
const createProject = (dbName: string) => {
    app.post("/" + dbName + "/create", uploadFile(makeID(10)), async (req, res) => {
        try {
            let warning = undefined;
            if (!req.body.title || !req.body.description || !req.body.date) {
                warning = "Missing element(s) in body of query";
            }
            if (!req.file) {
                warning = "No image in query";
            }
            const id = req.file.filename;
            listID.push(id);
            console.log("new id: "+id)

            const metadata = {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
            }
            await mongoInsertProject(dbName, id, metadata);
            const resMessage = {message: 'creation successful', id, metadata, warning};
            res.status(HttpStatus.OK).send(resMessage);
        } catch (e) {
            const errorMessage = {
                message: "Upload problem!",
                error: e.message,
                path: dbName,
                body: req.body,
                id: req.file.id
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

const loadProject = async (dbName: string) => {
    app.get("/" + dbName + "/load", async (req, res) => {
        try {
            const id = req.query.id;
            console.log()
            if (!id) {
                throw new Error('Missing id in query');
            }
            const metadata = await mongoFetchProject(dbName, id.toString());
            const resMessage = {message: 'fetch successful', id, metadata};
            res.status(HttpStatus.OK).send(resMessage).sendFile(path.join(__dirname, '../../uploads/'+id));
        } catch (e) {
            const errorMessage = {
                message: "Download problem!",
                error: e.message,
                path: dbName,
                id: req.query.id
            }
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    });
}