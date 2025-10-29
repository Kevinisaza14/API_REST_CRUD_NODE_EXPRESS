const db = require("../config/connection.js");
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require("crypto-js");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports // 587 port en false
    auth: {
        user: "infotoplistapps@gmail.com",
        pass: "lehn uhhs chxb idhl",
    },
});
async function textEmail(email, subject, text, html) {
    const info = await transporter.sendMail({
        from: '"No-Reply " <infotoplistapps@gmail.com>',
        to: `${email}`,
        subject: subject,
        text: text,
        html: html,
    });
    console.log("Message sent: %s", info.messageId);
}
// creamos schema de validacion signUpSchema //
const signUpSchema = Joi.object({ // Validar que objeto no este creado.
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    userName: Joi.string().min(3).max(15).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$')).required(),
    role: Joi.string().valid("admin", "user").default("user")
});
const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
const passwordSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    newPassword: Joi.string().min(6).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$')).required(),
    repeatPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});
exports.signUp = async (req, res) => {
    let connection;
    try {
        // validar 
        const { error } = signUpSchema.validate(req.body);
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
        if (userEmailExists.length > 0) {
            return res.status(400).json({
                message: `Usuario con email: ${email} ya registrado en la Base de datos!`,
                error: "Error de validación"
            });
        }
        const [usernameexist] = await connection.query("select userName from users where userName = ?", [userName]);
        if (usernameexist.length > 0) {
            return res.status(400).json({
                message: `Usuario: ${firstName} ya registrado en la Base de datos!`,
                error: "Error de validación"
            });
        }
        const subject = `Bienvenido a nuestra plataformavirtual [Nombre de la Empresa]`;
        const text = `Hola ${firstName},
            ¡Gracias por unirte a [Nombre de la Empresa]! Estamos emocionados de tenerte como parte de nuestra comunidad. Desde ahora, tendrás acceso a una selección exclusiva de productos cuidadosamente seleccionados y diseñados para mejorar tu experiencia de compra.
            
            ¿Qué puedes hacer ahora?
            Explorar productos: Encuentra los mejores artículos que se adapten a tus necesidades.
            Acceder a ofertas exclusivas: Como nuevo miembro, estarás entre los primeros en conocer nuestras promociones y lanzamientos especiales.
            Personalizar tu experiencia: Guarda tus productos favoritos, crea listas de deseos, y mucho más.
            Para comenzar, simplemente inicia sesión en tu cuenta y empieza a explorar.
            
            Si tienes alguna pregunta o necesitas asistencia, nuestro equipo de soporte está aquí para ayudarte en cada paso.
            
            Bienvenido a una nueva experiencia de compra en [Nombre de la Empresa]. ¡Esperamos que disfrutes cada momento!
            
            Gracias por confiar en nosotros,
            [Nombre de la Empresa]
            Soporte al Cliente`;
        const html = `
            <p>Hola ${firstName},</p>
            <p>¡Gracias por unirte a [Nombre de la Empresa]! Estamos emocionados de tenerte como parte de nuestra comunidad. Desde ahora, tendrás acceso a una selección exclusiva de productos cuidadosamente seleccionados y diseñados para mejorar tu experiencia de compra.</p>
            <p><strong>¿Qué puedes hacer ahora?</strong></p>
            <ul>
                <li>Explorar productos: Encuentra los mejores artículos que se adapten a tus necesidades.</li>
                <li>Acceder a ofertas exclusivas: Como nuevo miembro, estarás entre los primeros en conocer nuestras promociones y lanzamientos especiales.</li>
                <li>Personalizar tu experiencia: Guarda tus productos favoritos, crea listas de deseos, y mucho más.</li>
            </ul>
            <p>Para comenzar, simplemente inicia sesión en tu cuenta y empieza a explorar.</p>
            <p>Si tienes alguna pregunta o necesitas asistencia, nuestro equipo de soporte está aquí para ayudarte en cada paso.</p>
            <p>Bienvenido a una nueva experiencia de compra en [Nombre de la Empresa]. ¡Esperamos que disfrutes cada momento!</p>
            <p>Gracias por confiar en nosotros,<br>[Nombre de la Empresa]<br>Soporte al Cliente</p>
        `;
        await textEmail(email, subject, text, html);
        const id = uuidv4();
        const hashPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();
        // evitar inyección sql
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
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo registrar usuario",
            error: "Error 500: " + error
        });
    } finally {
        if (connection) connection.release();
    }
}
exports.signIn = async (req, res) => {
    let connection;
    try {
        // validar 
        const { error } = signInSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                error: "Error de validación"
            });
        }
        // destructuring object
        const { email, password } = req.body;
        connection = await db.getConnection();
        // Validar que el email esté registrado en MySQL
        const [user] = await connection.query("select * from users where email = ?", [email]);
        if (user.length === 0) {
            return res.status(200).json({
                message: `Usuario con email: ${email} no registrado en la APIRest!`,
                error: "Error de Inicio de Sesión"
            });
        }
        // desencriptar password
        const originalPassword = CryptoJS.AES.decrypt(user[0].password, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8)
        if (password !== originalPassword) {
            return res.status(200).json({
                message: `Contraseña errónea!`,
                error: "Error de Inicio de Sesión"
            });
        }
        const updateLastLoginSql = "UPDATE users SET lastLogin = NOW() WHERE email = ?"; // actualizamos lastLogin
        await connection.query(updateLastLoginSql, [email]);
        const id = uuidv4();
        // Eliminar token anterior si existe
        const token = jwt.sign({
            id: user[0].userID, // payload
            firstName: user[0].firstName, // payload
            lastName: user[0].lastName, // payload
            email: user[0].email, // payload
            role: user[0].role, // payload envia role dentro del token
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // Eliminar token anterior si existe
        const deleteOldTokenSql = "DELETE FROM UserTokens WHERE userID = ?";
        if (deleteOldTokenSql) {
            await connection.query(deleteOldTokenSql, [user[0].userID]);
        }
        // Guardar el nuevo token en la base de datos
        const timenow = new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        const insertTokenSql = "insert into UserTokens values (?, ?, ?, default, ?);"
        await connection.query(insertTokenSql, [id, user[0].userID, token, timenow]);
        return res.status(200).json({
            message: `Login correcto!`,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error de Inicio de Sesión",
            error: "Error 500: " + error
        });
    } finally {
        if (connection) connection.release();
    }
}
exports.logout = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const deleteTokenSql = "DELETE FROM UserTokens WHERE userID = ?";
        await connection.query(deleteTokenSql, [req.user.id]);
        return res.status(200).json({
            message: "Sesión cerrada correctamente!"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo cerrar la sesión",
            error: "Error 500: " + error
        });
    } finally {
        if (connection) connection.release();
    }
}
exports.profile = async (req, res) => {
    const creationDate = new Date(req.user.iat * 1000).toLocaleString();
    const expiresDate = new Date(req.user.exp * 1000).toLocaleString();
    res.json({
        message: "Bienvenido a tu perfil de usuario: " + req.user.firstName,
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            creationDate,
            expiresDate
        }
    });
}
exports.forgetPassword = async (req, res) => {
    let connection;
    try {
        // Validar que el email no este registrado en MySQL
        const { error } = passwordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                error: "Error de validación passwords no coinciden"
            });
        }
        const { email, newPassword, repeatPassword } = req.body;
        connection = await db.getConnection();
        const userEmailExists = await connection.query("select email from users where email = ?", [email]);
        if (!userEmailExists) {
            return res.status(403).json({
                message: `Usuario con email: ${email} no existe por favor registrarse!`,
                error: "Error de autenticacion"
            });
        }
        if (newPassword !== repeatPassword) {
            return res.status(400).json({
                message: "Las contraseñas no coinciden",
                error: "Error de validación"
            });
        }
        
        // Generar nuevo password
        const hashPassword = CryptoJS.AES.encrypt(newPassword, process.env.CRYPTO_SECRET).toString();
        const updatePasswordSql = "UPDATE users SET password = ? WHERE email = ?";
        await connection.query(updatePasswordSql, [hashPassword, email]);
        const subject = "Restablecimiento de Contraseña";
        const text = "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no has solicitado un cambio de contraseña, ignora este correo o contáctanos inmediatamente para proteger la seguridad de tu cuenta. Gracias por tu confianza, Soporte Técnico1. ingresa aqui para restablecer tu contraseña: " + url;
        const html = "<b><p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p> <p>Si no has solicitado un cambio de contraseña, ignora este correo o contáctanos inmediatamente para proteger la seguridad de tu cuenta.</p> <p>Gracias por tu confianza,<br>Soporte Técnico. ingresa aqui para restablecer</p></b>";

        await textEmail(email, subject, text, html);
        return res.status(200).json({
            message: "Contraseña actualizada correctamente!"
        });
    } catch (error) {
        return res.status(500).json({
            message: "No se pudo actualizar la contraseña",
            error: "Error 500: " + error
        });
    } finally {
        if (connection) connection.release();
    }
}