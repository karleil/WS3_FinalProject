require('dotenv').config();
const express = require('express');
const guitarRouter = express.Router();
const upload = require('../storage');
const db = require('../db');
const authenticateToken = require("../auth.jwt");

guitarRouter.use(authenticateToken);

guitarRouter.get("/", (req, res) => { 
    const brandFilters = req.query.brands;

    const user_id = req.user.userId;

    let sql = `
    SELECT guitar.*, brands.name AS brand, guitar.brand_id AS brand_id
    FROM guitar
    JOIN brands ON guitar.brand_id = brands.id
    `;
    const conditions = []; 
    const queryParams = [];

    if (brandFilters) { 
        const brands = Array.isArray(brandFilters) ? brandFilters : [brandFilters];
        conditions.push(`guitar.brand_id IN (${brands.map(() => '?').join(',')})`);
        queryParams.push(...brands);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
        sql += ' AND guitar.user_id = ?';
    } else {
        sql += ' WHERE guitar.user_id = ?';
    }
    queryParams.push(user_id);
      
    db.query(sql, queryParams, (error, results) => {
        if (error) {
            console.log("User making request:", req.user);
            res.status(500).send(error);
            return;
        }
        res.json(results);
    });
});

guitarRouter.get('/:id', (req, res) => { 

    const { id } = req.params;
    const user_id = req.user.userId;

    const sql = ` 
    SELECT guitar.*, brands.name AS brand, guitar.brand_id AS brand_id, guitar.description
    FROM guitar
    JOIN brands ON guitar.brand_id = brands.id
    WHERE guitar.id = ? AND guitar.user_id = ?
    `;
    
    db.query(sql, [id, user_id], (error, results) => {

        if (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }

        res.json(results[0]);
    });
});

guitarRouter.post('/', upload.single('image'),  (req, res) => {

    const { brand_id, title, description } = req.body;
    const user_id = req.user.userId;
    const image_name = req.file.filename;

    const addguitarSQL = `INSERT INTO guitar (brand_id, name, image_name, description, user_id) VALUES (?, ?, ?, ?, ?)`;

    db.query(addguitarSQL, [brand_id, title, image_name, description, user_id], (error, results) => {

        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred');
        }

        res.status(200).json({ message: 'guitar added.' });
    });
});

guitarRouter.put("/:id", upload.single("image"), (req, res) => { 

    const { id } = req.params;
    const user_id = req.user.userId;
    const { brand_id, title, description } = req.body;

    let updateguitarSQL =
    `UPDATE guitar
    SET brand_id = ?, name = ?, description = ? `;

    const queryParams = [brand_id, title, description];

    if (req.file) {
        updateguitarSQL += `, image_name = ? `;
        queryParams.push(req.file.filename);
    }

    updateguitarSQL += `WHERE id=? AND user_id = ? LIMIT 1`;
    queryParams.push(id);
    queryParams.push(user_id);

    db.query(updateguitarSQL, queryParams, (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }

        res.json({ message: "guitar updated." });
    });
});

guitarRouter.delete("/:id", (req, res) => { 

    const id = req.params.id;
    const user_id = req.user.userId;
    const sql = `DELETE FROM guitar WHERE id = ? AND user_id = ? LIMIT 1`;

    db.query(sql, [id, user_id], (error, results) => {

        if(error) {
          console.log(error); 
          res.status(500).send("Internal Server Error");
        }
    
        res.json({message: "guitar Deleted"});
    
      });
});

module.exports = guitarRouter;