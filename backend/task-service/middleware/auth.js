const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.orgId = decoded.orgId;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = { verifyToken };