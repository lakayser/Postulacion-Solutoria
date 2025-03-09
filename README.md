# Postulacion-Solutoria
Este proyecto utiliza MySQL como base de datos y React para la interfaz de usuario.

## Pasos para configurar la base de datos
Instalar MySQL
Si aún no tienes MySQL instalado, puedes descargarlo desde el siguiente enlace:
[Descargar MySQL](https://dev.mysql.com/downloads/)

### 1. Crear la base de datos
Antes de importar la estructura, debes crear la base de datos en MySQL. Para hacerlo, ejecuta el siguiente comando en la terminal:
(Se te pedirá que ingreses la contraseña de MySQL)
```
mysql -u root -p -e "CREATE DATABASE solutoria;"
```
### 2. Importar la estructura de la base de datos
Una vez creada la base de datos, importa la estructura ejecutando el siguiente comando:
```
mysql -u root -p solutoria < estructura.sql
```
### 3. Configurar la conexión en el proyecto
Abre el archivo server.js  y reemplaza TU_CONTRASEÑA con la contraseña que usas para MySQL
```
const db = mysql.createConnection({
  host: "localhost", 
  user: "root",
  password: "TU_CONTRASEÑA",
  database: "solutoria",
});
```
### 4. Ejecutar el proyecto
1. Instalar las dependencias: Ejecuta el siguiente comando en la terminal:
```
npm install
```
2. Ejecutar el servidor: En una terminal, ejecuta el servidor con el siguiente comando:
```
node server.js
```
3. Iniciar el front-end: En una segunda terminal, ejecuta el siguiente comando para iniciar el front-end en React:
```
npm start
```