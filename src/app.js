import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";

// De clases
import mocksRouter from "./routes/mocks.router.js";
import envConfig from "./config/envConfig.js";
import logger from "./services/logger.js";

import __dirname from "./utils/index.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion Adoptme",
      version: "1.0.0",
      description: "Documentación de la API con Swagger",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

console.log(`${__dirname}`);

const specs = swaggerJSDoc(swaggerOptions);

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser());

app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);

// Nuevo endpoint
app.use("/api/mocks", mocksRouter);

// Conexion a mongo
const CONNECTION_STRING = envConfig.app.MONGO.URL;
mongoose
  .connect(CONNECTION_STRING)
  .then(() => {
    logger.info("Database connected successfully");
  })
  .catch((error) => {
    logger.error("Database connection error:", error);
  });

// Iniciar server
const server = app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});

export default app;
