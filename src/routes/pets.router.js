import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';
import compression from "express-compression"


const router = Router();
router.use(compression())

router.get('/',petsController.getAllPets);
router.post('/',petsController.createPet);
router.post('/withimage',uploader.single('image'), petsController.createPetWithImage);
router.put('/:pid',petsController.updatePet);
router.delete('/:pid',petsController.deletePet);

export default router;