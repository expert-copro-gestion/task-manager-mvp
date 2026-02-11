const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

// ===== GET ALL TASKS =====
const getTasks = async (req, res) => {
    try {
        const orgId = req.orgId;
        const { assignedTo, completed } = req.query;

        let query = 'SELECT * FROM tasks WHERE org_id = $1';
        let params = [orgId];

        if (assignedTo) {
            query += ` AND assigned_to = $${params.length + 1}`;
            params.push(assignedTo);
        }

        if (completed !== undefined) {
            query += ` AND completed = $${params.length + 1}`;
            params.push(completed === 'true');
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Get tasks error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== CREATE TASK =====
const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;
        const orgId = req.orgId;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const result = await pool.query(
            `INSERT INTO tasks (title, description, assigned_to, org_id, completed, created_by)
       VALUES ($1, $2, $3, $4, false, $5)
       RETURNING *`,
            [title, description || null, assignedTo, orgId, req.userId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create task error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== UPDATE TASK (mark as complete/incomplete) =====
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { completed, title, description, assignedTo } = req.body;
        const orgId = req.orgId;

        // Vérifier que la tâche appartient à l'org
        const checkTask = await pool.query(
            'SELECT id FROM tasks WHERE id = $1 AND org_id = $2',
            [id, orgId]
        );

        if (checkTask.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Construire la requête UPDATE dynamiquement
        let updateQuery = 'UPDATE tasks SET ';
        let params = [];
        let paramIndex = 1;

        if (completed !== undefined) {
            updateQuery += `completed = $${paramIndex}`;
            params.push(completed);
            paramIndex++;
        }

        if (title !== undefined) {
            if (params.length > 0) updateQuery += ', ';
            updateQuery += `title = $${paramIndex}`;
            params.push(title);
            paramIndex++;
        }

        if (description !== undefined) {
            if (params.length > 0) updateQuery += ', ';
            updateQuery += `description = $${paramIndex}`;
            params.push(description);
            paramIndex++;
        }

        if (assignedTo !== undefined) {
            if (params.length > 0) updateQuery += ', ';
            updateQuery += `assigned_to = $${paramIndex}`;
            params.push(assignedTo);
            paramIndex++;
        }

        updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
        params.push(id);

        const result = await pool.query(updateQuery, params);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update task error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== DELETE TASK =====
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const orgId = req.orgId;

        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND org_id = $2 RETURNING id',
            [id, orgId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted', id: result.rows[0].id });
    } catch (err) {
        console.error('Delete task error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };