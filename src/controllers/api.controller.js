const db = require("../config/connection.js");

exports.getProducts = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        // comprobamos si existen datos en la tabla products
        const ifexistsdataproducts = `select * from products`;
        await connection.query(ifexistsdataproducts);
        if (ifexistsdataproducts > 0) {
            const deleteproducts = `delete from products`;
            await connection.query(deleteproducts);
            // Se han eliminado los datos de la tabla products
        }
        const response = await fetch("https://fakestoreapi.com/products");
        const responseJSON = await response.json();
        const values = responseJSON.map(product => [
            product.id,
            product.title,
            product.price,
            product.description,
            product.image,
            product.rating.count
        ]);
        const query = `insert into products values ${values.map(() => "(?, ?, ?, ?, ?, ?, default)").join(", ")}`;
        // await connection.query(`insert into products values (?, ?, ?, ?, ?, ?, default)`, [product.id, product.title, product.price, product.description, product.image, product.rating.count]);
        await connection.query(query, values.flat());
        return res (values);
    } catch (error) {
        return error;
    } finally {
        if (connection) connection.release();
    }
}