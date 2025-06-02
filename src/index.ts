import express, { json } from "express";
import cors, { CorsOptions, StaticOrigin } from "cors";
import morgan from "morgan";
import { authRouter } from "./routes/auth.route";

const app = express();

//Allowed origin to deploy frontEnd in localhost
const trueOrigin: StaticOrigin = ["http://localhost:3000"];

//CORS configuration
const corsOptions: CorsOptions = {
  credentials: true,
  origin: trueOrigin,
};

app.use(cors(corsOptions));

//Morgan configuration dev mode
app.use(morgan("dev"));

//JSON reader express configuration
app.use(json());

//API routes
app.use('/api', authRouter) //Authentication

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.listen(3000);
console.log("Servidor corriendo en http://localhost:3000 ✅")
