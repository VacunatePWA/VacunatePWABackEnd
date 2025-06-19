import { Router } from 'express';
import { UserClinicController } from '../controllers/UserClinic.controller';
import { validateAccess } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(validateAccess);

// Asignar centro a usuario
router.post('/assign', UserClinicController.assignClinicToUser);

// Remover asignación de centro
router.delete('/remove', UserClinicController.removeClinicFromUser);

// Obtener centros de un usuario
router.get('/user/:userId/clinics', UserClinicController.getUserClinics);

// Obtener usuarios de un centro
router.get('/clinic/:clinicId/users', UserClinicController.getClinicUsers);

// Obtener centros disponibles para asignar a un usuario
router.get('/user/:userId/available-clinics', UserClinicController.getAvailableClinics);

// Rutas para supervisión y colegas
router.get('/user/:userId/supervised', UserClinicController.getSupervisedUsers);
router.get('/user/:userId/supervisor', UserClinicController.getUserSupervisor);
router.get('/user/:userId/colleagues', UserClinicController.getColleagues);

export default router;
