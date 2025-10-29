const db = require("../config/connection.js");
const axios = require('axios');
const cheerio = require('cheerio');

exports.getPopulation = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const responseXarxa = await axios.get("https://xarxaindustrial.net/ca/poblacions/");
        const $ = cheerio.load(responseXarxa.data);
        const data = [];

        $('a.xi-a.xi-a-poblaciones').each((index, element) => {
            const label = $(element).text().trim();
            const href = $(element).attr('href');
            data.push(`${label},${href}`);
        });
        const values = data.map(item => [
            item.split(",")[0],
            item.split(",")[1]
        ]);
        console.log("Poblacion en la db guardada", values);
        await connection.query('INSERT INTO xarxa (name, url) VALUES ?', [values]);
        return res (values);
    } catch (error) {
        return error;
    } finally {
        if (connection) connection.release();
    }
}
exports.getempresas = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('SELECT url FROM xarxa;');
        const data = [];
        for (const row of rows) {
            const response = await axios.get(row.url);
            const $ = cheerio.load(response.data);
            $('a.xi-a.xi-a-clientes').each((index, element) => {
                const url = $(element).attr('href');
                data.push({url});
            });
        }
        const values = data.map(item => [
            item.url
        ]);
        await connection.query('INSERT INTO empresas (url) VALUES ?', [values]);
        return res.json(data);
    } catch (error) {
        return error;
    } finally {
        if (connection) connection.release();
    }
}
exports.getempresasinfo = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [rows] = await connection.query('select url from empresas');
        const data = [];
        for (const row of rows) {
            const response = await axios.get(row.url);
            const $ = cheerio.load(response.data);
            const localidad = $('label.xi-label.xi-label-ficha-main').eq(1).text().trim() || '';
            const nameFullText = $('label.xi-label.xi-label-ficha-main').text().trim();
            const nameMatch = nameFullText.match(/Contacta amb\s*(.*)/);
            const name = nameMatch ? nameMatch[1].trim() : '';
            const direccion = $('label.xi-label.xi-label-ficha-datos').eq(0).text().trim() || '';
            const telefono = $('label.xi-label.xi-label-ficha-datos').eq(1).text().trim() || '';
            const email = $('label.xi-label.xi-label-ficha-datos').eq(2).text().trim() || '';
            const web = $('label.xi-label.xi-label-ficha-datos').eq(3).text().trim() || '';
            if (localidad || name || direccion || telefono || email || web) {
                if (telefono) {
                    console.log('telefono', telefono);
                    const sql = 'UPDATE empresas SET localidad = ?, nameCompany = ?, direccion = ?, telefono = ?, email = ?, web = ? WHERE url = ?';
                    await connection.query(sql, [localidad, name, direccion, telefono, email, web, row.url]);
                    data.push({ localidad, name, direccion, telefono, email, web });
                }
                else {
                    const sql = 'UPDATE empresas SET localidad = ?, nameCompany = ?, direccion = ?, telefono = ?, email = ?, web = ?, Estado_Empresa = "no activa" WHERE url = ?';
                    await connection.query(sql, [localidad, name, direccion, telefono, email, web, row.url]);
                    data.push({ localidad, name, direccion, telefono, email, web });
                }
            }
        }
        return res.json(data);
    } catch (error) {
        return error;
    } finally {
        if (connection) connection.release();
    }
}
