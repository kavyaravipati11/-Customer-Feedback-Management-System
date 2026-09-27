const express = require("express");
const router = express.Router();

const db = require("./db");


// ===============================
// GET ALL CUSTOMERS
// ===============================
router.get("/", (req, res) => {

    const sql = `
        SELECT
            customer_id,
            name,
            email,
            country
        FROM customers
        ORDER BY customer_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("GET CUSTOMERS ERROR:", err);

            return res.status(500).json({
                message: "Unable to load customers",
                error: err.message
            });

        }

        res.json(results);

    });

});


// ===============================
// GET CUSTOMER BY ID
// ===============================
router.get("/:id", (req, res) => {

    const sql = `
        SELECT
            customer_id,
            name,
            email,
            country
        FROM customers
        WHERE customer_id = ?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Unable to get customer",
                    error: err.message
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message: "Customer not found"
                });

            }

            res.json(results[0]);

        }
    );

});


// ===============================
// ADD CUSTOMER
// ===============================
router.post("/", (req, res) => {

    const {
        name,
        email,
        country
    } = req.body;


    if (!name || !email || !country) {

        return res.status(400).json({
            message: "Name, email and country are required"
        });

    }


    const sql = `
        INSERT INTO customers
        (
            name,
            email,
            country
        )
        VALUES (?, ?, ?)
    `;


    db.query(
        sql,
        [
            name,
            email,
            country
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "ADD CUSTOMER ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to add customer",
                    error: err.message
                });

            }


            res.status(201).json({

                message:
                    "Customer added successfully",

                customer_id:
                    result.insertId

            });

        }
    );

});


// ===============================
// UPDATE CUSTOMER
// ===============================
router.put("/:id", (req, res) => {

    const {
        name,
        email,
        country
    } = req.body;


    const sql = `
        UPDATE customers
        SET
            name = ?,
            email = ?,
            country = ?
        WHERE customer_id = ?
    `;


    db.query(
        sql,
        [
            name,
            email,
            country,
            req.params.id
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "UPDATE CUSTOMER ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to update customer",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Customer not found"
                });

            }


            res.json({
                message:
                    "Customer updated successfully"
            });

        }
    );

});


// ===============================
// DELETE CUSTOMER
// ===============================
router.delete("/:id", (req, res) => {

    const sql = `
        DELETE FROM customers
        WHERE customer_id = ?
    `;


    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {

                console.error(
                    "DELETE CUSTOMER ERROR:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to delete customer",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Customer not found"
                });

            }


            res.json({
                message:
                    "Customer deleted successfully"
            });

        }
    );

});


module.exports = router;