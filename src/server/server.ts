import express from "express";
import multer from "multer"
import path from "path"
import {Server} from "http";
import {mongoInsertProject} from "@database/mongo"
import HttpStatus from "http-status-codes"

//multer file storage with new name and prev extension
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});

const upload = multer({storage: storage});
const app = express();
const PORT = 8080;
let server: Server;
let listID: string[] = [];

export const serverInit = () => {
    app.get('/', (req, res) => res.send('Express + TypeScript Server'));
    serverStart();
    createProject("maison");
    addToProject("maison");
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
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for (const element of listID){
        if (result == element){
            result = makeID(length);
            break;
        }
    }
    return result;
}

/// send in body title, description and date for new
const createProject = (projectType: string) => {
    app.post("/"+ projectType +"/create", upload.single("image"), async (req, res) => {
        try {
            if (!req.file || !req.body.title || !req.body.description || !req.body.date) {
                throw new Error;
            }
            const imageName = req.file.filename;
            console.log("image name: " + imageName);
            const imageTitle = req.body.title;
            console.log("image title: " + imageTitle);
            const imageDescription = req.body.description;
            console.log("image description: " + imageDescription);
            const imageDate = req.body.date;
            console.log("image description: " + imageDate);

            const generatedID = makeID(10);
            listID.push(generatedID);


            await mongoInsertProject(projectType, generatedID, imageTitle, imageDescription, imageDate);
            console.log("right before sending HTTP response")

            const resMessage = {message: 'creation successful', id: generatedID};
            res.status(HttpStatus.OK).send(resMessage);
            resetConnection();
        } catch (e) {
            const errorMessage = {error: 'Missing element in query '+ projectType + "_add. Empty fields: `` ``.",
                title: req.body.title || "",
                description: req.body.description || "",
                date: req.body.date || "",
                imageName: req.file.filename || ""}
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}

/// send in body title, description and date for new
const addToProject = (projectType: string) => {
    app.post("/"+ projectType +"/add", upload.single("image"), (req, res) => {
        try {
            if (!req.file || !req.body.description) {
                throw new Error;
            }
            const imageDescription = req.body.description;
            console.log("image description: " + imageDescription);

            const generatedID = makeID(10);
            listID.push(generatedID);
            const resMessage = {message: 'creation successful', id: generatedID}
            res.status(HttpStatus.OK).send(resMessage);
            resetConnection();
        } catch (e) {
            const errorMessage = {error: 'Missing element in query '+ projectType + "_add. Empty fields: `` ``.",
                description: req.body.description || "",
                imageName: req.file.filename || ""}
            console.log(errorMessage);
            res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
        }
    })
}
