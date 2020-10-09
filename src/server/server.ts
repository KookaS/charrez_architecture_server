import express from "express";
import multer from "multer"
import path from "path"
import {Server} from "http";
import {mongoInit} from "@database/mongo"

//multex file storage with new name and prev extension
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
}

/// send in body title, description and date for new
const createProject = (projectType: string) => {
    app.post("/"+ projectType +"/create", upload.single("image"), (req, res) => {
        try {
            //check image
            if (!req.file) {
                throw new Error('No image sent');
            }
            const imageName = req.file.filename;
            console.log("image name: " + imageName);
            //check title
            if (!req.body.title) {
                throw new Error('No title given');
            }
            const imageTitle = req.body.title;
            console.log("image title: " + imageTitle);
            //check description
            if (!req.body.description) {
                throw new Error('No description given');
            }
            const imageDescription = req.body.description;
            console.log("image description: " + imageDescription);
            // check date
            if (!req.body.date) {
                throw new Error('No date given');
            }
            const imageDate = req.body.date;
            console.log("image description: " + imageDate);

            const generatedID = makeID(10);
            listID.push(generatedID);
            const resMessage = {message: 'creation successful', id: generatedID}
            res.status(200).send(resMessage);
            resetConnection();
        } catch (e) {
            res.status(400).send(e.message);
        }
    })
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
