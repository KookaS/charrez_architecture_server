import path from "path";
import {serverInit, checkQuery} from "@server/server";
// let serverInit() = require("./server/server")
import express from "express";

// const app = express();
// const PORT = 8080;
// app.get('/', (req,res) => res.send('Express + TypeScript Server'));
// app.listen(PORT, () => {
//     console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
// });

serverInit();