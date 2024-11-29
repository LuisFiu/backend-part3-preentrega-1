# 1. Imagen base
FROM node:18-alpine

# 2. Establecer directorio de trabajo en el contenedor
WORKDIR /app

# 3. Copiar archivos de tu proyecto al contenedor
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el resto del proyecto
COPY . .

# 6. Exponer el puerto en el que tu aplicación escucha
EXPOSE 8080

# 7. Comando para ejecutar tu aplicación
CMD ["npm", "start"]
