const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = new Pool({
    connectionString: 'postgresql://task_manager_prod_a7tm_user:y43kVhPnb4mkiPiOPZxIfLkHCaGGHjI6@dpg-d66bh4ur433s73dg4ks0-a.frankfurt-postgres.render.com:5432/task_manager_prod_a7tm?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

// ===== LOGIN =====
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, orgId: user.org_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                orgId: user.org_id
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== SIGNUP =====
const signup = async (req, res) => {
    try {
        const { name, email, password, orgCode } = req.body;

        if (!name || !email || !password || !orgCode) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const orgResult = await pool.query(
            'SELECT id FROM organizations WHERE code = $1',
            [orgCode]
        );

        if (orgResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid organization code' });
        }

        const orgId = orgResult.rows[0].id;

        const emailResult = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (emailResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash, org_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, org_id',
            [name, email, hashedPassword, orgId, 'USER']
        );

        const newUser = result.rows[0];

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, orgId: newUser.org_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                orgId: newUser.org_id
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// ===== VERIFY TOKEN =====
const verifyToken = async (req, res) => {
    res.json({ valid: true, userId: req.userId });
};

module.exports = { login, signup, verifyToken };