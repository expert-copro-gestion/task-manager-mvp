const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'auth-service' });
});

// Routes
app.use('/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`✅ Auth Service running on http://localhost:${PORT}`);
});