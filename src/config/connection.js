const connection = require("mysql2/promise");

const db = connection.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    waitForConnections: true,
    queueLimit: 0
});
async function testConnection() {
    try {
        const dbConnection = await db.getConnection();
        console.log(`Conectado al servidor de MySQL: ${process.env.DB_HOST}`);
        dbConnection.release();
    } catch (error) {
        console.log("Error en la conexión MySQL server: " + error);
    }
}
testConnection();
module.exports = db;