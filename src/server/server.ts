import express from "express";
import multer from "multer"
import path from "path"
import {Server} from "http";

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

export const serverInit = () => {
    app.get('/', (req,res) => res.send('Express + TypeScript Server'));
    let server = serverStart();

    checkQuery(server);
}

export const checkQuery = (server: Server) => {

    app.post("/categories/upload", upload.single("image"), (req, res) => {
        try {
            if (!req.file) {
                throw new Error('No files sent');
            }
            const imageID = req.file.filename;
            console.log("idImage: "+imageID);

            if (!req.body.description){
                throw new Error('No body sent, no description');
            }
            const imageDescription = req.body.description;
            console.log("imageDescription: "+imageDescription);

            res.status(200).send('creation successful');
            server = resetConnection(server);
        }catch (e) {
            res.status(400).send(e.message);
        }
    })
}

/// restart the server
const resetConnection = (server: Server) => {
    server.close();
    return serverStart();
}

/// start listening on the port
const serverStart = () => {
    return app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    });
}
