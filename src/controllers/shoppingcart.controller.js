const db = require("../config/connection.js");

exports.createShoppingCart = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const { productId, stock } = req.body;
        const { id } = req.user;
        const [ifexistproduct] = await connection.query("SELECT * FROM ShoppingCart WHERE productID = ?", [productId]);
        if(ifexistproduct.length > 0){
            updateShoppingCart(productId, stock);
        }
        const timenow = new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        const sql = `INSERT INTO ShoppingCart VALUES (default, ?, ?, ?, ?)`;
        await connection.query(sql, [id, productId, stock, timenow]);
        return res.status(201).json({
            message: "ShoppingCart registrado correctamente!",
            user: {
                id, productId, stock
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear el ShoppingCart', 
            error 
        });
    } finally {
        if (connection) connection.release();
    }
};
exports.getAllShoppingCart = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const { userID } = req.user;
        const [result] = await connection.query("SELECT * FROM ShoppingCart WHERE userID = ?", [userID]);
        if (result.length === 0) {
            return res.status(204).json({
                message: "Carrito de compras vacío"
            });
        }
        return res.status(200).json({
            message: "Lista de ShoppingCart encontrados",
            result
        });
    }
    catch (error) {
        return res.status(500).json({ 
            message: 'Error al obtener los ShoppingCart', 
            error: "Error 500 " + error
        });
    }
    finally {
        if (connection) connection.release();
    }
}; 
exports.updateShoppingCart = async (req, res) => {
    let connection;
    try {
        const productId = req.body.productId || req.query.productId;
        const [ifexistproduct] = await connection.query("SELECT * FROM ShoppingCart WHERE productID = ?", [productId]);
        const newstock = await connection.query("SELECT stock FROM ShoppingCart WHERE productID = ?", [productId]);
        const stock = req.body.stock || req.query.stock;
        const totalstock = newstock[0].stock + stock;
        if(ifexistproduct.length > 0){
            connection = await db.getConnection();
            const sql = `UPDATE ShoppingCart SET stock = ? WHERE productID = ?`;
            await connection.query(sql, [totalstock, productId]);
            return res.status(200).json({
                message: "ShoppingCart actualizado correctamente!",
                user: {
                    productId, stock
                }
            });
        }
        connection = await db.getConnection();
        if(ifexistproduct.length > 0){
            const sql = `UPDATE ShoppingCart SET stock = ? WHERE productID = ?`;
            await connection.query(sql, [stock, productId]);
            return res.status(200).json({
                message: "ShoppingCart actualizado correctamente!",
                user: {
                    userID, productId, stock
                }
            });
        }
        return res.status(404).json({
            message: "ShoppingCart no encontrado"
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar el ShoppingCart', 
            error 
        });
    } finally {
        if (connection) connection.release();
    }
};