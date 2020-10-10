import express from "express";
import {Server} from "http";
import {mongoInsertProject} from "@database/mongo"
import HttpStatus from "http-status-codes"
import {uploadFile} from "@database/upload"
import multer from "multer";
import path from "path";
import GridFsStorage from "multer-gridfs-storage"
import {MongoHelper} from "@database/helper";

const app = express();
const PORT = 8080;
let server: Server;
let listID: string[] = [];

export const serverInit = () => {
    app.get('/', (req, res) => res.send('Express + TypeScript Server'));
    serverStart();
    createProject("maison", "create", "maison");
    createProject("immeuble", "create", "immeuble");
    //addToProject("maison");
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
const createProject = (projectType: string, requestType: string, uploadFolder?: string) => {
    app.post("/" + projectType + "/" + requestType, uploadFile(uploadFolder), async (req, res) => {
        try {
            req.file.metadata = {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date
            }
            console.log()
            console.log(req.file)

            // await mongoInsertProject(projectType, generatedID, imageTitle, imageDescription, imageDate);

            const resMessage = {message: 'creation successful', id: req.file.id, metadata: req.file.metadata};
            res.status(HttpStatus.OK).send(resMessage);
            resetConnection();
        } catch (e) {
            const errorMessage = {
                error: "File has not been uploaded!",
                projectType,
                requestType,
                body: req.body}
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}