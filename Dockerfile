# Usa una imagen de Node específica para la versión de Angular
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de paquete e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente de la aplicación
COPY . .

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 4200

# Comando para iniciar la aplicación
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
