const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'user-service' });
});

// Routes
app.use('/users', userRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`\n👥 User Service running on http://localhost:${PORT}`);
    console.log(`   - GET    http://localhost:${PORT}/users`);
    console.log(`   - GET    http://localhost:${PORT}/users/:id`);
    console.log(`   - PATCH  http://localhost:${PORT}/users/:id`);
    console.log(`   - GET    http://localhost:${PORT}/users/organizations/:code\n`);
});