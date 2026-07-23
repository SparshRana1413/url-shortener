import express from 'express';
import 'dotenv/config';
import './config/db.js';
import cors from 'cors';

import mainRouter from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', mainRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server started on http://localhost:${process.env.SERVER_PORT}`
  );
});