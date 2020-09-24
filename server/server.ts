import path from "path";
import router from "@server/routes/routes";
import express from 'express';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);

export default app;
