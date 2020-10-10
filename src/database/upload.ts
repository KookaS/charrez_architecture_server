import multer from "multer";
import {MongoHelper} from "@database/helper";
import GridFsStorage from 'multer-gridfs-storage';

// collection name is file: db.fs.files
export const uploadFile = ( dbName: string) => {
    let url = MongoHelper.url+"/"+dbName;
    let storage = new GridFsStorage({
        url,
        options: {useNewUrlParser: true, useUnifiedTopology: true},
        file: (req, file) => {
            return new Promise((resolve) => {
                const filename = Date.now() + file.originalname.trim();
                const fileInfo = {
                    filename: filename
                };
                resolve(fileInfo);
            });
        }
    });
    console.log("upload URL: " + url);
    return multer({storage: storage}).single("file");
}
