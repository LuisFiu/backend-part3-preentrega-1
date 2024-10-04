import logger from "../services/logger.js";
import userModel from "./models/User.js";

export default class Users {
    
    get = (params) =>{
        return userModel.find(params);
    }

    getBy = (params) =>{
        return userModel.findOne(params);
    }

    save = (doc) =>{
        return userModel.create(doc);
    }

    create = (params) =>{
        return userModel.create(params);
    }

    async insertMany(users) {
        try {
            const result = await userModel.insertMany(users);
            return result;
        } catch (error) {
            logger.fatal(`Error inserting users: ${error.message}`);
        }
    }

    update = (id,doc) =>{
        return userModel.findByIdAndUpdate(id,{$set:doc})
    }

    delete = (id) =>{
        return userModel.findByIdAndDelete(id);
    }
}