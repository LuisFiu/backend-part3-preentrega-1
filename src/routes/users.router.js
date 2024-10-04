import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import compression from "express-compression"


const router = Router();
router.use(compression())

router.get('/',usersController.getAllUsers);

router.get('/:uid',usersController.getUser);
router.put('/:uid',usersController.updateUser);
router.delete('/:uid',usersController.deleteUser);


export default router;