import multer from "multer";
import * as fs from "fs";

// random ID generator
const makeID = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    //maybe check existence of similar id
    return result;
}

export const uploadFile = () => {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            const path = `./uploads`
            fs.mkdirSync(path, { recursive: true })
            callback(null, path)
        },
        filename: (req, file, callback) => {
            callback(null, makeID(20))
        }
    });
    return multer({storage: storage}).single("file");
}


