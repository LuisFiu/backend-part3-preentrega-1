import { petsService, usersService } from "../services/index.js";
import logger from "../services/logger.js";
import { generateMockPets, generateMockUsers } from "../services/mocksServices.js";
import { createHash} from "../utils/index.js";

const mockingusers = async (req, res) => {
    try {
        const mockedUsers = await generateMockUsers(50); // 50 usuarios
        const generatedUsers = await usersService.insertManyUsers(mockedUsers);
        
        return res.status(201).json({ status: "success", payload: generatedUsers });
    } catch (error) {
        logger.fatal("Error generating or inserting users:", error);
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
}

const mockingpets = async (req, res) => {
    try {
        const mockedPets = await generateMockPets(100); // 100 mascotas
        const generatedPets = await petsService.insertManyPets(mockedPets);
        
        return res.status(201).json({ status: "success", payload: generatedPets });
    } catch (error) {
        logger.fatal("Error generating or inserting petss:", error);
        return res.status(500).send({ status: "error", error: "Internal server error" });
    }
}

const generateData = async (req, res) => {
    try {

        const { users , pets } = req.body

        if(!users ||  !pets){
            return res.status(400).json({status:"error", messag:"Incomplete values"})
        }

        if(typeof users ==! "number" && typeof pets ==! "number"){
            return res.status(400).json({status:"error", messag:"Invalid values format"})
        }

        const mockedUsers = await generateMockUsers(users);
        const mockedPets = await generateMockPets(pets)

        // Se genera pets y users
        const generatedUsers = await usersService.insertManyUsers(mockedUsers);
        
        const generatedPets = await petsService.insertManyPets(mockedPets)
        
        return res.status(201).json({ status: "success", payload: {generatedUsers, generatedPets} });
    } catch (error) {
        logger.fatal("Error generating or inserting many", error);
        return res.status(500).send({ status: "error", error: "Internal server error" });
    }
}

export default {
    mockingusers,
    generateData,
    mockingpets
}