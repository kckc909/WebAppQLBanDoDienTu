﻿const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/users.controllers');

// GET /api/<table>
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/login', ctrl.login);

module.exports = router;
