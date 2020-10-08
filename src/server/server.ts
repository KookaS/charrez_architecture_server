import path from "path";
import express from "express";
import router from "@server/routes";

const app = express();

export const serverInit = () => {
    const PORT = 8080;
    app.get('/', (req,res) => res.send('Express + TypeScript Server'));
    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    });

    app.get('/test', (req, res, next) => {
        res.send('test successful')
    });
}

// kind of useless for now
export const stuff = () => {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../client'));
    app.use(express.static(path.join(__dirname, '../client')));
    app.use('/', router);
}

