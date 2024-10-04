import GenericRepository from "./GenericRepository.js";

export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    insertManyPets = (params) =>{
        return this.insertMany(params)
    }
}