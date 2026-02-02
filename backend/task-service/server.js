const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'task-service' });
});

// Routes
app.use('/tasks', taskRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`\n📋 Task Service running on http://localhost:${PORT}`);
    console.log(`   - GET  http://localhost:${PORT}/tasks`);
    console.log(`   - POST http://localhost:${PORT}/tasks`);
    console.log(`   - PATCH http://localhost:${PORT}/tasks/:id`);
    console.log(`   - DELETE http://localhost:${PORT}/tasks/:id\n`);
});