import express, { json } from "express";
import cors, { CorsOptions, StaticOrigin } from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route";
import { roleRouter } from "./routes/role.route";
import { vaccineRouter } from "./routes/vaccine.route";
import { clinicRouter } from "./routes/clinic.route";
import { childRouter } from "./routes/child.route";
import { recordRouter } from "./routes/record.route";
import { appointmentRouter } from "./routes/appointment.route";
import { vaccineSchemaRouter } from "./routes/vaccineSchema.route";
import { userChildRouter } from "./routes/userChild.route";
import { guardianRouter } from "./routes/guardian.route";
import vaccinationStatusRouter from "./routes/vaccinationStatus.route";
import userClinicRouter from "./routes/userClinic.route";
import { initializeCronJobs } from './index.cron';
import { sendEmail } from './utils/email.service';

const app = express();

//Allowed origin to deploy frontEnd in localhost
const trueOrigin: StaticOrigin = ["http://localhost:5173", "http://localhost:5174", "http://10.0.0.85:5173/"];

//CORS configuration
const corsOptions: CorsOptions = {
  credentials: true,
  origin: trueOrigin,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

// JSON parsing with error handling
app.use(json({ limit: '10mb' }));

// Error handling middleware for JSON parsing
app.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof SyntaxError && 'body' in error) {
    console.error('JSON Parse Error:', error.message);
    console.error('Request URL:', req.url);
    console.error('Request method:', req.method);
    return res.status(400).json({ 
      message: 'Invalid JSON format in request body',
      error: error.message 
    });
  }
  next(error);
});

app.use(cookieParser());

//API routes
app.use("/api", authRouter); //Authentication
app.use("/api", roleRouter); //Roles
app.use("/api", vaccineRouter); //Vaccines
app.use("/api", clinicRouter); //Clinics
app.use("/api", childRouter); //Childs
app.use("/api", recordRouter); //Records
app.use("/api", appointmentRouter); //Appointments
app.use("/api", vaccineSchemaRouter); //VaccineSchema
app.use("/api", userChildRouter); //User-Child relations
app.use("/api", guardianRouter); //Guardians/Tutors
app.use("/api", vaccinationStatusRouter); // Vaccination status endpoint
app.use("/api", userClinicRouter); // User-Clinic assignments
// app.use("/api", ...): monta todas las rutas de recursos principales

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

const main = async () => {
  try {
    const port = process.env.PORT || 3000;
    app.listen(port, async () => {
      console.log(`Server running on port ${port}`);
      
      // Inicializar las tareas programadas
      initializeCronJobs();

      // Enviar correo de prueba al iniciar
      if (process.env.EMAIL_USER) {
        try {
          await sendEmail({
            to: process.env.EMAIL_USER,
            subject: '✅ Servidor de Vacúnate RD Iniciado',
            html: `
              <p>El servidor de la aplicación Vacúnate RD se ha iniciado correctamente.</p>
              <p>Fecha y hora: ${new Date().toLocaleString('es-DO')}</p>
              <p>Las notificaciones automáticas están activas.</p>
            `,
          });
          console.log('Correo de prueba de inicio enviado exitosamente.');
        } catch (emailError) {
          console.error('Fallo al enviar el correo de prueba de inicio:', emailError);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

main();
