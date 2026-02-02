const express = require('express');
const { getUsers, getUserById, updateUser, getOrganizationByCode } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Endpoints protégés (nécessitent JWT)
router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUserById);
router.patch('/:id', verifyToken, updateUser);

// Endpoint public (pas besoin de JWT)
router.get('/organizations/:code', getOrganizationByCode);

module.exports = router;