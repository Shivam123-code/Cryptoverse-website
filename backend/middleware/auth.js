export const authenticateUser = (req, res, next) => {
    console.log("Session Data:", req.session);

    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    req.user = req.session.user;
    next();
};
