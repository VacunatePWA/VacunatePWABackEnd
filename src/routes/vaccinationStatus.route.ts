import { Router } from 'express';
import { VaccinationStatusController } from '../controllers/VaccinationStatus.controller';

const router = Router();

// GET /api/children/:idChild/vaccination-status
router.get('/children/:idChild/vaccination-status', VaccinationStatusController.getVaccinationStatus);

export default router;
