const express = require("express");
const brandRouter = express.Router();
const db = require("../db");

brandRouter.get("/", (req, res) => {
    const sql = 'SELECT * FROM brand';
    db.query(sql, (error, results) => {

        if (error) {
            res.status(500).send(error);
            return;
        }
        res.json(results)

    });
});

brandRouter.post('/', (req,res) =>{ //handles POST requests to add a new artist

    const {brand_name} = req.body; //this gets a new brand name from the req body.
    const addbrandSQL = `INSERT INTO brand (name) VALUES (?)`; //this creates an SQL query to insert the new brand to the database.
    db.query(addbrandSQL, [brand_name], (error, results) => { //executes the query but replaces the ? with the brand name
    
        if (error) { //error and success handling.
            console.error(error)
            return res.status(500).send('An error occurred');
        }
        res.json({ message: 'Brand added successfully', brand_id: results.insertId });
    });
});

module.exports = brandRouter;
