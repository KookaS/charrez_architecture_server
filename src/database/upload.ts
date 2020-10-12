import multer from "multer";
import {MongoHelper} from "@database/helper";
import GridFsStorage from 'multer-gridfs-storage';

let updatedMetadata: {};

// collection name is file: db.fs.files
export const uploadFile = ( dbName: string) => {
    let url = MongoHelper.url+"/"+dbName;
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
    console.log("upload URL: " + url);
    return multer({storage: storage}).single("file");
}

export const updateMetadata = (metadata: {}) => {
    updatedMetadata = metadata;
};
