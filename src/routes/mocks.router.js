import { Router} from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingusers',mocksController.mockingusers);
router.get('/mockingpets',mocksController.mockingpets);
router.get('/generateData',mocksController.generateData);


export default router;