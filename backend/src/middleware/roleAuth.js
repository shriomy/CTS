module.exports = function(requiredRole) {
    return function(req, res, next) {
        const user = req.user; // set by jwtAuth
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        if (user.role !== requiredRole) return res.status(403).json({ error: 'Forbidden' });
        next();
    }
};
