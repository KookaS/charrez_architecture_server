import multer from "multer";
import {MongoHelper} from "@database/helper";
import path from "path";
import * as fs from "fs";

/*
import GridFsStorage from 'multer-gridfs-storage';
let storage = new GridFsStorage({
        url,
        options: {useNewUrlParser: true, useUnifiedTopology: true},
        file: (req, file) => {
            return new Promise((resolve) => {
                const filename = Date.now() +"_"+ file.originalname.trim();
                const fileInfo = {
                    filename: filename,
                    metadata: updatedMetadata ? updatedMetadata : null
                };
                resolve(fileInfo);
            });
        }
    });
 */

// collection name is file: db.fs.files
export const uploadFile = ( id: string) => {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            const path = `./uploads`
            fs.mkdirSync(path, { recursive: true })
            callback(null, path)
        },
        filename: (req, file, callback) => {
            callback(null, id) //Appending extension
        }
    });
    return multer({storage: storage}).single("file");
}


