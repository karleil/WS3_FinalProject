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
    SELECT guitars.*, brands.name AS brand, guitars.brand_id AS brand_id, genres.name AS genre, guitars.genre_id = genres.id
    FROM guitars
    JOIN brands ON guitars.brand_id = brands.id
    `;
    const conditions = []; 
    const queryParams = [];

    if (brandFilters) { 
        const brands = Array.isArray(brandFilters) ? brandFilters : [brandFilters];
        conditions.push(`guitars.brand_id IN (${brands.map(() => '?').join(',')})`);
        queryParams.push(...brands);
      }
    
      if (genreFilters) {
        const genres = Array.isArray(genreFilters) ? genreFilters : [genreFilters];
        conditions.push(`guitars.genre_id IN (${genres.map(() => '?').join(',')})`);
        queryParams.push(...genres);
      }
      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
        sql += ' AND guitars.user_id = ?';
      } else {
        sql += ' WHERE guitars.user_id = ?';
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
    SELECT guitars.*, brands.name AS brand, guitars.brand_id AS brand_id, genres.name AS genre, guitars.genre_id = genres.id,  guitars.description
    FROM guitars
    JOIN brands ON guitars.brand_id = brands.id
    JOIN genres ON guitars.genre_id = genres.id
    WHERE guitars.id = ? AND guitars.user_id = ?
    `
    
    db.query(sql, [id, user_id], (error, results) => {

        if (error) {
            console.log(error)
            res.status(500).send("Internal Server Error")
        }

        res.json(results[0]);
    });
});

guitarRouter.post('/', upload.single('image'),  (req, res) => {

    const { brand_id, title, genre_id, description } = req.body;
    const user_id = req.user.userId;
    const image_name = req.file.filename;

    const addguitarsSQL = `INSERT INTO guitars (brand_id, name, genre_id, image_name, description, user_id) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(addguitarsSQL, [brand_id, title, genre_id, image_name, description, user_id], (error, results) => {

        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred');
        }

        res.status(200).json({ message: 'guitars added.' });
    });
});

guitarRouter.put("/:id", upload.single("image"), (req, res) => { 

    const { id } = req.params;
    const user_id = req.user.userId;
    const { brand_id, title, genre_id, description } = req.body;

    let updateguitarsSQL =
    `UPDATE guitars
    SET brand_id = ?, name = ?, genre_id = ? , description = ? `;

    const queryParams = [brand_id, title, genre_id, description];

    if (req.file) {
        updateguitarsSQL += `, image_name = ? `;
        queryParams.push(req.file.filename);
    }

    updateguitarsSQL += `WHERE id=? AND user_id = ? LIMIT 1`;
    queryParams.push(id);
    queryParams.push(user_id);

    db.query(updateguitarsSQL, queryParams, (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }

        res.json({ message: "guitars updated." });
    });
});

guitarRouter.delete("/:id", (req, res) => { 

    const id = req.params.id;
    const user_id = req.user.userId;
    const sql = `DELETE FROM guitars WHERE id = ? AND user_id = ? LIMIT 1`

    db.query(sql, [id, user_id], (error, results) => {

        if(error) {
          console.log(error); 
          res.status(500).send("Interal Server Error");
        }
    
        res.json({message: "guitars Deleted"});
    
      });
    
    });


guitarRouter.get('/:id', (req, res) => {

    const { id } = req.params;
});

module.exports = guitarRouter;