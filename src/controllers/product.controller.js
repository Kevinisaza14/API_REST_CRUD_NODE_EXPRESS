const db = require("../config/connection.js");
const Joi = require('joi');

const createSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    stock: Joi.number().required(),
});
// Crear un nuevo producto
exports.createProduct = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const { error } = createSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                error: "Error de validación"
            });
        }
        const { name, price, description, image, stock } = req.body;
        const sql = `INSERT INTO products (id, name, price, description, image, stock, default) VALUES (default, ?, ?, ?, ?, ?, default)`;
        await connection.query(sql, [name, price, description, image, stock]);
        return res.status(201).json({
            message: "Producto registrado correctamente!",
            user: {
                name, price, description, image, stock
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear el producto', 
            error 
        });
    } finally {
        if (connection) connection.release();
    }
};
// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [result] = await db.query("select * from products");
        if (result.length === 0) {
            return res.status(204).json({
                message: "No se encontraron productos"
            });
        }
        return res.status(200).json({
            message: "Lista de productos encontrados",
            result
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al obtener los productos', 
            error: "Error 500 " + error
        });
    } finally {
        if (connection) connection.release();
    }
};
// Obtener un producto por ID
exports.getProductById = async (req, res) => {
    try {
        connection = await db.getConnection();
        const [result] = await db.query("select * from products where productID = ?", [req.params.id]);
        if (result.length === 0) {
            return res.status(404).json({
                message: "No se encontro producto con el productID: " + req.params.id
            });
        }
        return res.status(200).json({
            message: "Producto encontrado",
            result
        });
    } catch (error) {
        res.status(500).json({
             message: 'Error al obtener el producto', 
             error 
        });
    } finally {
        if (connection) connection.release();
    }
};
// Actualizar un producto por ID
exports.updateProduct = async (req, res) => {
    let connection;
    try {
        const id = req.params.id;
        const { productName, price, description, image, stock } = req.body;
        connection = await db.getConnection();
        if (req.user.role == "admin") {
            const [result] = await db.query("select * from Products where productID = ?", [id]);
            if (result.length === 0) {
                return res.status(404).json({
                    message: "No se encontró producto con productID: " + id
                });
            }
            const updateFields = []; // Array para almacenar los campos a actualizar
            const values = []; // Array para almacenar los valores de los campos a actualizar
            function isexistprop(prop) {
                let propNames = Object.keys(req.body).find(key => req.body[key] === prop); // Obtiene el nombre de la propiedad ingresada por body que es la key // ejemplo: key = 'productName'
                if (prop) {
                    if (prop !== result[0].prop) {
                        updateFields.push(`${propNames} = ?`);
                        console.log(propNames);
                        values.push(prop);
                    } else {
                        return res.status(400).json({
                            message: `El campo ${propNames} es igual al actual`,
                            error: "Error de validación"
                        });
                    }
                }
            }
            isexistprop(productName);
            isexistprop(price);
            isexistprop(description);
            isexistprop(image);
            isexistprop(stock);
            values.push(id); // Agrega el id al final del array de valores
            if (updateFields.length === 0) {
                return res.status(400).json({
                    message: "No se han proporcionado los datos correctos ('productName', 'price', 'description', 'image' y 'stock')",
                    error: "Error de validación"
                });
            }
            const sql = `update products set ${updateFields.join(', ')} where productID = ?`;
            await db.query(sql, values);
            return res.status(201).json({
                message: "Producto actualizado correctamente",
                user: { id, productName, price, description, image, stock }
            });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    } finally {
        if (connection) connection.release();
    }
};
// Eliminar un producto por ID
exports.deleteProduct = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await db.getConnection();
        const [result] = await db.query("select * from products where productID = ?", [id]);
        if (result.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        await db.query("delete from products where productID = ?", [id]);
        return res.status(200).json({
            message: "Usuario eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    } finally {
        if (connection) connection.release();
    }
};