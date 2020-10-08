import express from "express";
import {mongoCreate} from "@database/mongo"


const app = express();

export const serverInit = () => {
    const PORT = 8080;
    app.get('/', (req,res) => res.send('Express + TypeScript Server'));
    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    });
    mongoCreate();
}

export const checkQuery = () => {
    // next calls the next functions
    app.get('/test', (req, res) => {
        res.send('test successful')
    });

    app.post("/categories/create", (req, res) => {
        try {
            console.log(req.body)

            if (!req.body) {
                res.status(400);
                throw new Error('Body is empty');
            }

            res.sendStatus(200);
            res.send('creation successful');
        }catch (e) {
            res.json({error: {message: e.message}});
        }
    })
}
