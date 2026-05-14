import 'dotenv/config'; // Move to the very top
import express from 'express';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.get("/health", (req,res)=>{
    res.json({"status":"ok"});
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});