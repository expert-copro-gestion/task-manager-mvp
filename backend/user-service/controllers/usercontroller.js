const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// ===== GET ALL USERS BY ORG =====
const getUsers = async (req, res) => {
    try {
        const orgId = req.orgId;

        const result = await pool.query(
            'SELECT id, name, email, org_id, role, created_at FROM users WHERE org_id = $1 ORDER BY name',
            [orgId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== GET USER BY ID =====
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const orgId = req.orgId;

        const result = await pool.query(
            'SELECT id, name, email, org_id, role, created_at FROM users WHERE id = $1 AND org_id = $2',
            [id, orgId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Get user by id error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== UPDATE USER PROFILE =====
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const orgId = req.orgId;

        // Vérifier que l'utilisateur existe et appartient à l'org
        const checkUser = await pool.query(
            'SELECT id FROM users WHERE id = $1 AND org_id = $2',
            [id, orgId]
        );

        if (checkUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Construire la requête UPDATE
        let updateQuery = 'UPDATE users SET ';
        let params = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updateQuery += `name = $${paramIndex}`;
            params.push(name);
            paramIndex++;
        }

        if (email !== undefined) {
            if (params.length > 0) updateQuery += ', ';
            updateQuery += `email = $${paramIndex}`;
            params.push(email);
            paramIndex++;
        }

        updateQuery += ` WHERE id = $${paramIndex} AND org_id = $${paramIndex + 1} RETURNING id, name, email, org_id, role, created_at`;
        params.push(id, orgId);

        const result = await pool.query(updateQuery, params);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== GET ORGANIZATION BY CODE =====
const getOrganizationByCode = async (req, res) => {
    try {
        const { code } = req.params;

        const result = await pool.query(
            'SELECT id, name, code FROM organizations WHERE code = $1',
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Get organization error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getUsers, getUserById, updateUser, getOrganizationByCode };