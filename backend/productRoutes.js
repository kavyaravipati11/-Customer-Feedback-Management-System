const express = require("express");
const router = express.Router();

const db = require("./db");


// GET ALL PRODUCTS
router.get("/", (req, res) => {

    const sql = `
        SELECT
            product_id,
            name,
            category
        FROM products
        ORDER BY product_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Unable to load products",
                error: err.message
            });

        }

        res.json(results);

    });

});


// GET PRODUCT BY ID
router.get("/:id", (req, res) => {

    const sql = `
        SELECT
            product_id,
            name,
            category
        FROM products
        WHERE product_id = ?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    message: "Unable to get product",
                    error: err.message
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }

            res.json(results[0]);

        }
    );

});


// ADD PRODUCT
router.post("/", (req, res) => {

    const {
        name,
        category
    } = req.body;


    if (!name || !category) {

        return res.status(400).json({
            message:
                "Product name and category are required"
        });

    }


    const sql = `
        INSERT INTO products
        (
            name,
            category
        )
        VALUES (?, ?)
    `;


    db.query(
        sql,
        [name, category],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Failed to add product",
                    error: err.message
                });

            }


            res.status(201).json({

                message:
                    "Product added successfully",

                product_id:
                    result.insertId

            });

        }
    );

});


// UPDATE PRODUCT
router.put("/:id", (req, res) => {

    const {
        name,
        category
    } = req.body;


    const sql = `
        UPDATE products
        SET
            name = ?,
            category = ?
        WHERE product_id = ?
    `;


    db.query(
        sql,
        [
            name,
            category,
            req.params.id
        ],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Failed to update product",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }


            res.json({
                message:
                    "Product updated successfully"
            });

        }
    );

});


// DELETE PRODUCT
router.delete("/:id", (req, res) => {

    const sql = `
        DELETE FROM products
        WHERE product_id = ?
    `;


    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Failed to delete product",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }


            res.json({
                message:
                    "Product deleted successfully"
            });

        }
    );

});


module.exports = router;