const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer TOKEN"
    
    if (!token) return res.status(401).json({ message: 'Access denied, token missing!' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
    // Add this check after jwt.verify
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        
        // Verify user still exists in database
        const user = await findEmployeeById(decoded.id);
        if (!user) return res.status(403).json({ message: 'User no longer exists' });
        
        req.user = { id: user.id, role: user.role };
        next();
    });
};

module.exports = authenticateToken;