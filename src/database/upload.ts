import multer from "multer";
import * as fs from "fs";
import {generateID} from "@server/generatorID";
import dotenv from "dotenv";

dotenv.config();


//store the "file" from request into /uploads
export const uploadFile = () => {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            const path = `${process.env.API_IMG}`
            fs.mkdirSync(path, { recursive: true })
            callback(null, path)
        },
        filename: (req, file, callback) => {
            callback(null, generateID(20))
        }
    });
    return multer({storage: storage}).single("file");
}


