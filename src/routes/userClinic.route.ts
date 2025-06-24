import { Router } from 'express';
import { UserClinicController } from '../controllers/UserClinic.controller';
import { validateAccess } from '../middlewares/auth.middleware';

const router = Router();

router.use(validateAccess);

router.post('/assign', UserClinicController.assignClinicToUser);

router.delete('/remove', UserClinicController.removeClinicFromUser);

router.get('/user/:userId/clinics', UserClinicController.getUserClinics);

router.get('/clinic/:clinicId/users', UserClinicController.getClinicUsers);

router.get('/user/:userId/available-clinics', UserClinicController.getAvailableClinics);

router.get('/user/:userId/supervised', UserClinicController.getSupervisedUsers);
router.get('/user/:userId/supervisor', UserClinicController.getUserSupervisor);
router.get('/user/:userId/colleagues', UserClinicController.getColleagues);

export default router;
