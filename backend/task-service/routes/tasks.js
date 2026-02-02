const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Protéger tous les endpoints avec JWT
router.use(verifyToken);

// GET all tasks (avec filtres optionnels)
router.get('/', getTasks);

// POST create new task
router.post('/', createTask);

// PATCH update task
router.patch('/:id', updateTask);

// DELETE task
router.delete('/:id', deleteTask);

module.exports = router;