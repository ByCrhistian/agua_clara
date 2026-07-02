//mysql/promise nso permite usar las consultas, async/await
const mysql = require('mysql2/promise');


//createPool crea un grupo de conexiones
//Reutiliza las conexiones en vez de abrir y cerrar
//una conexion cada vez que se hace una consulta
const db = mysql.createPool({
    // Procesa y lee las variables del archivo .env
    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,
});

//Exportar las conexiones y poderlas usar
module.exports = db;