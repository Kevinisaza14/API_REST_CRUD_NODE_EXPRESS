const db = require("../config/connection.js");
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require("crypto-js");
const Joi = require('joi');

const userSchema = Joi.object({ // Validar que objeto no este creado.
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    userName: Joi.string().min(3).max(15).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$')).required(),
    role: Joi.string().valid("admin", "user").default("user")
});
const updateSchema = Joi.object({
    firstName: Joi.string().min(3).max(20),
    lastName: Joi.string().min(3).max(15),
    userName: Joi.string().min(3).max(15),
    password: Joi.string().min(6).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$'))
});
exports.createUser = async (req, res) => {
    let connection;
    try {
        // validar datos que ingresan en el body
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                error: "Error de validación"
            });
        }
        // destructuring object
        const { firstName, lastName, userName, email, password, role } = req.body;
        connection = await db.getConnection();
        // Validar que el email no este registrado en MySQL
        const [userEmailExists] = await connection.query("select email from users where email = ?", [email]);
        if (userEmailExists.length > 0) { // si el email ya existe en la base de datos
            return res.status(400).json({
                message: `Usuario con email: ${email} ya registrado en la APIRest!`,
                error: "Error de validación"
            });
        }
        // Validar que el userName no este registrado en MySQL
        const [usernameexist] = await connection.query("select userName from users where userName = ?", [userName]);
        if (usernameexist.length > 0) { // si el username ya existe en la base de datos
            return res.status(400).json({
                message: `Usuario con username: ${userName} ya registrado en la APIRest!`,
                error: "Error de validación"
            });
        }
        const id = uuidv4();
        const hashPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();
        // evitar inyección sql
        if (req.user.role == "admin") { // si el rol es admin, puede asignar el role que desee
            if (role) { // si se envia role se asigna el role enviado
                const sql = "insert into users values (?, ?, ?, ?, ?, ?, ?, default, default)";
                await connection.query(sql, [id, firstName, lastName, userName, email, hashPassword, role]);
                return res.status(201).json({
                    message: "Usuario registrado correctamente!",
                    user: { id, firstName, lastName, userName, email, hashPassword, role }
                });
            } else { // si no se envia role se asigna por defecto "user"
                const sql = "insert into users values (?, ?, ?, ?, ?, ?, default, default, default)";
                await connection.query(sql, [id, firstName, lastName, userName, email, hashPassword]);
                return res.status(201).json({
                    message: "Usuario registrado correctamente!",
                    user: { id, firstName, lastName, userName, email, hashPassword }
                });
            }
        } else { // si el rol es user, no puede crear usuarios de ningun tipo.
            return res.status(401).json({
                message: "No tienes permisos para crear usuarios",
                error: "Error 401"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo registrar usuario",
            error: "Error 500: " + error
        });
    } finally {
        if (connection) connection.release();
    }
}
exports.getAllUsers = async (req, res) => {
    let connection; // declarada fuera para que se pueda acceder desde cada bloque
    try {
        connection = await db.getConnection();
        const [result] = await db.query("select * from users");
        if (result.length === 0) {
            return res.status(204).json({
                message: "No se encontraron usuarios"
            });
        }
        return res.status(200).json({
            message: "Lista de usuarios encontrados",
            result
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo obtener los usuarios",
            error: "Error 500: " + error
        });
    } finally {
        if (connection) connection.release();
    }
}
exports.getUserById = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [result] = await db.query("select * from users where userID = ?", [req.params.id]);
        if (result.length === 0) {
            return res.status(404).json({
                message: "No se encontro usuario con el userID: " + req.params.id
            });
        }
        return res.status(200).json({
            message: "Usuario encontrado",
            result
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo obtener el usuario",
            error: "Error 500: " + error
        });
    } finally {
        if (connection) connection.release();
    }
}
exports.updateUser = async (req, res) => {
    try {
        const idlog = uuidv4();
        const id = req.params.id;
        const { firstName, lastName, userName, password } = req.body;
        const updateFields = [];
        const values = [];
        if (req.user.role == "admin") { // si el rol es admin, puede actualizar cualquier usuario.
            connection = await db.getConnection();
            // validar si la id por url existe
            const [result] = await db.query("select * from users where userID = ?", [id]);
            if (result.length === 0) {
                return res.status(404).json({
                    message: "No se encontró usuario con userID: " + id
                });
            }
            /* const originalPassword = CryptoJS.AES.decrypt(result[0].password, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8)
            if (password !== originalPassword) {
                return res.status(200).json({
                    message: `Contraseña errónea!`,
                    error: "Error de Inicio de Sesión"
                });
            } */
            const { error } = updateSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message,
                    error: "Error de validación"
                });
            }
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
            isexistprop(firstName);
            isexistprop(lastName);
            isexistprop(userName);
            const hashPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();
            if (password) {
                updateFields.push("password = ?");
                values.push(hashPassword);
            }
            values.push(id);
            // validar que no vengan otras props por el body
            if (updateFields.length === 0) {
                return res.status(400).json({
                    message: "No se han proporcionado los datos correctos ('firstName', 'lastName', 'userName' y 'password')",
                    error: "Error de validación"
                });
            }
            const sql = `update users set ${updateFields.join(', ')} where userID = ?`;
            await db.query(sql, values);
            const newlog = `insert into UserLogs values (?, ?, ?, ?, default)`;
            await db.query(newlog, [idlog, id, req.user.id, 'update user']);
            return res.status(201).json({
                message: "Usuario actualizado correctamente",
                user: { id, firstName, lastName, userName, hashPassword }
            });
        } else if (req.user.id === id) { // Solo puede actualizar su propio usuario.
            connection = await db.getConnection();
            // validar si la id por url existe
            const [result] = await db.query("select * from users where userID = ?", [id]);
            if (result.length === 0) {
                return res.status(404).json({
                    message: "No se encontró usuario con userID: " + id
                });
            }
            const { error } = updateSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    message: error.details[0].message,
                    error: "Error de validación"
                });
            }
            if (firstName) {
                if (firstName !== result[0].firstName) {
                    updateFields.push("firstName = ?");
                    values.push(firstName);
                } else {
                    return res.status(400).json({
                        message: "El campo firstName es igual al actual",
                        error: "Error de validación"
                    });
                }
            }
            if (lastName) {
                if (lastName !== result[0].lastName) {
                    updateFields.push("lastName = ?");
                    values.push(lastName);
                } else {
                    return res.status(400).json({
                        message: "El campo lastName es igual al actual",
                        error: "Error de validación"
                    });
                }
            }
            if (userName) {
                if (userName !== result[0].userName) {
                    updateFields.push("userName = ?");
                    values.push(userName);
                } else {
                    return res.status(400).json({
                        message: "El campo userName es igual al actual",
                        error: "Error de validación"
                    });
                }
            }
            const hashPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();
            if (password) {
                updateFields.push("password = ?");
                values.push(hashPassword);
            }
            values.push(id);
            // validar que no vengan otras props por el body
            if (updateFields.length === 0) {
                return res.status(400).json({
                    message: "No se han proporcionado los datos correctos ('firstName', 'lastName', 'userName' y 'password')",
                    error: "Error de validación"
                });
            }
            const sql = `update users set ${updateFields.join(', ')} where userID = ?`;
            await db.query(sql, values);
            const newlog = `insert into UserLogs values (?, ?, ?, ?, default)`;
            await db.query(newlog, [idlog, id, req.user.id, 'update user']);
            return res.status(201).json({
                message: "Usuario actualizado correctamente",
                user: { id, firstName, lastName, userName, hashPassword }
            });
        } else {
            return res.status(401).json({
                message: "No tienes permisos para actualizar este usuario",
                error: "Error 401"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo actualizar usuario",
            error: "Error 500: " + error
        });
    } finally {
        if (connection) connection.release();
    }
}
exports.deleteUser = async (req, res) => {
    let connection;
    try {
        const idlog = uuidv4();
        const { id } = req.params;
        connection = await db.getConnection();
        const [result] = await db.query("select * from users where userID = ?", [id]);
        if (result.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        await db.query("delete from users where userID = ?", [id]);
        const newlog = (`insert into UserLogs values (?, ?, ?, ?, default)`);
        await db.query(newlog, [idlog, id, req.user.id, 'Delete user']);
        return res.status(200).json({
            message: "Usuario eliminado correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo eliminar usuario",
            error: "Error 500: " + error
        });
    } finally {
        if (connection) connection.release();
    }
}