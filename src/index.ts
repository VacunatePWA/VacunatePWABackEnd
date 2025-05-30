import express from 'express';
import cors from 'cors';
import moduleName from 'jsonwebtoken';


const app = express();

app.get('/', (req, res) => {
    res.send("Hola mundo")
})

app.listen(3000);