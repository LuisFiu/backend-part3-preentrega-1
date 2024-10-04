import petModel from "./models/Pet.js";

export default class Pet {

    get = (params) =>{
        return petModel.find(params)
    }

    getBy = (params) =>{
        return petModel.findOne(params);
    }

    save = (doc) =>{
        return petModel.create(doc);
    }

    async insertMany(pets) {
        try {
            const result = await petModel.insertMany(pets);
            return result;
        } catch (error) {
            logger.fatal(`Error inserting pets: ${error.message}`);
        }
    }

    update = (id,doc) =>{
        return petModel.findByIdAndUpdate(id,{$set:doc})
    }

    delete = (id) =>{
        return petModel.findByIdAndDelete(id);
    }
}