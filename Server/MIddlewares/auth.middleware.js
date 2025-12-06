const { getUser } = require("../utils/auth");

async function authMiddleware(req, res, next) {
    let token = req.cookies.token;

    // Debug logging
    console.log("Auth Debug - Cookies:", req.cookies);
    console.log("Auth Debug - Headers:", req.headers);
    console.log("Auth Debug - Authorization Header:", req.headers.authorization);

    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        console.log("Auth Debug - No token found");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const user = getUser(token);
        req.user = user;
        next();
    } catch (err) {
        console.log("Auth Debug - Invalid token:", err.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = { authMiddleware };