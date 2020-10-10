import multer from "multer";
import {MongoHelper} from "@database/helper";
import GridFsStorage from 'multer-gridfs-storage';

export const uploadFile = ( uploadFolder?: string) => {
    let url = MongoHelper.url;
    uploadFolder ? url = url+"/"+uploadFolder: {};
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
