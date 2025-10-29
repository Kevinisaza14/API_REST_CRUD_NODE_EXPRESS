const jwt = require('jsonwebtoken');

 // middleware de autenticación
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization; // recogemos el token del header del postman
    if (!token) {
        return res.status(403).json({
            message: "Token no proporcionado",
            error: "Error de autenticación"
        });
    }
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        // Agregamos en el "req"los datos que vienen en el token
        req.user = decoded; //req.user = {id: 1, email: "email"} es un objeto que tiene dentro lo que encripto el token
        next(); // continuamos enviando la petición la ruta donde se creo authMiddleware la cual sera recogida por req
    } catch (error) {
        return res.status(401).json({
            message: "Token no autorizado ó caducado",
            error: "Error de autenticación"
        });
    }
}
module.exports = authMiddleware;