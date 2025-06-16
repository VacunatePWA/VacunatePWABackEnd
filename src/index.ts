import express, { json } from "express";
import cors, { CorsOptions, StaticOrigin } from "cors";
import morgan from "morgan";
import { authRouter } from "./routes/auth.route";
import { roleRouter } from "./routes/role.route";
import { vaccineRouter } from "./routes/vaccine.route";
import { guardianRouter } from "./routes/guardian.route";
import { clinicRouter } from "./routes/clinic.route";
import { childRouter } from "./routes/child.route";
import { recordRouter } from "./routes/record.route";
import { appointmentRouter } from "./routes/appointment.route";
import { vaccineSchemaRouter } from "./routes/vaccineSchema.route";
import { GuardianChildRouter } from "./routes/guardianChild.route";

const app = express();

//Allowed origin to deploy frontEnd in localhost
const trueOrigin: StaticOrigin = ["http://localhost:3000"];

//CORS configuration
const corsOptions: CorsOptions = {
  credentials: true,
  origin: trueOrigin,
};
``
app.use(cors(corsOptions));

//Morgan configuration dev mode
app.use(morgan("dev"));

//JSON reader express configuration
app.use(json());

//API routes
app.use('/api', authRouter) //Authentication
app.use('/api', roleRouter) //Roles
app.use('/api', vaccineRouter) //Vaccines
app.use('/api', guardianRouter) //Guardians
app.use('/api', clinicRouter) //Clinics
app.use('/api', childRouter) //Childs
app.use('/api', recordRouter) //Records
app.use('/api', appointmentRouter) //Appointments
app.use('/api', vaccineSchemaRouter) //VaccineSchema
app.use('/api', GuardianChildRouter) //GuardianChild


app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.listen(3000);
console.log("Servidor corriendo en http://localhost:3000 ✅")
