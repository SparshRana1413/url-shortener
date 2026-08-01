import express from 'express';
import 'dotenv/config';
import './config/db.js';
import cors from 'cors';
import redisClient from './config/redis.js';

import mainRouter from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', mainRouter);
app.use(errorHandler);

try{
  await redisClient.connect();
} catch (err){
  console.error("Could not connect to redis");
}

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server started on http://localhost:${process.env.SERVER_PORT}`
  );
});