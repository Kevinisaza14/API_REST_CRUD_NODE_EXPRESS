const express = require('express');
const router = express.Router();
// const userRoutes = require('./routes/user.routes.js');
const prueba = require('../controllers/api.prueba.js');

router.get('/prueba', prueba.getPopulation);
router.get('/prueba1', prueba.getempresas);
router.get('/prueba2', prueba.getempresasinfo);

module.exports = router;