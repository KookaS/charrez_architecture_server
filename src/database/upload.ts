import multer from "multer";
import * as fs from "fs";
import {generateID} from "@server/generatorID";
import dotenv from "dotenv";
import path from "path";

dotenv.config();


//store the "file" from request into /uploads
export const uploadFile = () => {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdirSync(`${process.env.API_IMG}`, { recursive: true })
            callback(null, `${process.env.API_IMG}`)
        },
        filename: (req, file, callback) => {
            callback(null, generateID(20))
        }
    });
    return multer({storage: storage}).single("file");
}
