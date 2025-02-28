import winston from "winston";
import 'winston-compat'; 

const customLevelOptions = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        debug:4
    },
    colors:{
        fatal:'inverse yellow',
        error:'bold red',
        warning:'yellow',
        info:'blue',
        debug:'rainbow',
    }
}

const logger = winston.createLogger({
    levels:customLevelOptions.levels,
    transports:[
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(winston.format.colorize(
                {colors:customLevelOptions.colors}
            ), winston.format.simple()
        )
        })
    ]
})

const addLogger = (req,res,next) => {
    req.logger = logger
    req.logger.info(`${req.method} on ${req.url} - ${new Date().toLocaleDateString}`)
}

export default logger