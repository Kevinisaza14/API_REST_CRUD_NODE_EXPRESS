const express = require('express'); // importamos express
const cors = require("cors"); // importamos cors para permitir peticiones desde cualquier origen
require("dotenv").config(); // importamos la configuración de entorno process.env.
const api = new express(); // creamos una nueva instancia de express
const authRoutes = require("./routes/auth.routes.js"); // importamos las rutas de auth
const userRoutes = require("./routes/user.routes.js"); // importamos las rutas de user
const productRoutes = require('./routes/product.routes.js'); // importamos las rutas de product
const apiController = require('./controllers/api.controller.js'); // importamos el controlador de la API
const shoppingRoutes = require('./routes/shoppingcart.routes.js'); // importamos las rutas de shop
const apiprueba = require('./routes/api.prueba.js');

//configurar middlewares
api.use(express.json());
api.use(cors()); // mejora problemas en cabeceras CORS
api.use('/api/v1', authRoutes, userRoutes, productRoutes, shoppingRoutes, apiprueba); // montamos las rutas en /api/v1
api.use((req, res) => {
    res.status(404).json({
        message: "Ruta no encontrada",
        error: "Error 404"
    });
});
apiController.getProducts(); // llamamos a la función para inicializar la base de datos

const PORT = process.env.PORT || 3000;
api.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});