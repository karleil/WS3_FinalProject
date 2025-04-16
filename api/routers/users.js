require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const usersRouter = express.Router();

usersRouter.post("/", [
    body("email").isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password").isLength( { min: 8 } ).withMessage("Must be at least 8 characters long")
], async (req, res) => {


    const errors = validationResult(req);


    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() })
    }

    const email = req.body.email; 
    const password = req.body.password;


    const hashedPassword = await bcrypt.hash(password, 10);


    db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword], 
        (error, result) => {

            if(error) {
                console.log(error);
                return res.status(500).send();
            }

            res.status(201).json({
                message: "User Created!",
                userId: result.insertId
            })

        }
    );

});

usersRouter.post("/sign-in", async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE email=?", [email], async (error, result) => {

        if (error) {
            return res.status(500).json({ "message": "Server error" });
        }


        if (result.length === 0) {
            return res.status(401).json({ "message": "Invalid Email or Password" });
        }

        const userData = result[0];


        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            return res.status(401).json({ "message": "Invalid Email or Password" });
        }


        const token = jwt.sign({
            userId: userData.id,
            email: userData.email
        }, JWT_SECRET, { expiresIn: "6hr" });

        res.json({ message: "Success!", jwt: token });
    })

})

module.exports = usersRouter;
