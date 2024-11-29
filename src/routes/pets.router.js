import { Router } from "express";
import petsController from "../controllers/pets.controller.js";
import compression from "express-compression";

const router = Router();
router.use(compression());

router.get("/", petsController.getAllPets);
router.post("/", petsController.createPet);
router.put("/:pid", petsController.updatePet);
router.delete("/:pid", petsController.deletePet);

export default router;
