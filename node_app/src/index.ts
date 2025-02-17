import express from 'express';
import bodyParser from 'body-parser';
import { appRouter } from './sow-smart';
import cors from 'cors';

const app = express();
const port = 8000;

export const client = require('./db.ts')
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.use('/', appRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

client.connect();
