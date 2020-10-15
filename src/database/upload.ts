import multer from "multer";
import * as fs from "fs";

export const uploadFile = ( id: string) => {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            const path = `./uploads`
            fs.mkdirSync(path, { recursive: true })
            callback(null, path)
        },
        filename: (req, file, callback) => {
            callback(null, id)
        }
    });
    return multer({storage: storage}).single("file");
}


