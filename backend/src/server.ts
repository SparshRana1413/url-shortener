//imports
import express from 'express';
import 'dotenv/config';
import pool from './config/db.js';
import mainRouter from './routes/index.js';

//inital setup
const app = express();
app.use('/', mainRouter);


app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`Server started on http://localhost:${process.env.SERVER_PORT}`)
});