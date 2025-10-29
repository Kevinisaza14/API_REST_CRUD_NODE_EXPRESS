const db = require("../config/connection.js");

const validarStock = async (req, res, next) => {
    let connection;
    try {
        const productos = req.body.productos;
        connection = await db.getConnection();
        const ids = productos.map(producto => producto.id);
        const stock = 'SELECT stock FROM products WHERE productID = ?';
        const [rows] = await connection.query(stock, [ids]);
        productos.forEach(producto => {
            if (producto.stock > 0) {
                console.log(`Producto: ${producto.nombre}, Cantidad: ${producto.stock}`);
            } else {
                console.log(`Producto: ${producto.nombre}, No tenemos stock disponible`);
            }
        });
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error al validar el stock, Por favor intentalo mas tarde', error });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = validarStock;