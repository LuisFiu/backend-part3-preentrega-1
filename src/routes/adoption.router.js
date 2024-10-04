import { Router} from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';
import compression from "express-compression"


const router = Router();
router.use(compression())

router.get('/',adoptionsController.getAllAdoptions);
router.get('/:aid',adoptionsController.getAdoption);
router.post('/:uid/:pid',adoptionsController.createAdoption);

export default router;