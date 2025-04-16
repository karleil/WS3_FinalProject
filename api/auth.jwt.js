const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


const authenticateToken = (req, res, next) => {


    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];


    if(!token) {
        return res.status(401).json({ message: "Access Denied" })
    }

    jwt.verify(token, JWT_SECRET, (error, userData) => {


        if(error) {
            return res.status(403).json({ message: "Invalid or expired token" })
        }

        req.user = userData;
        next();

    })

}

module.exports = authenticateToken;
