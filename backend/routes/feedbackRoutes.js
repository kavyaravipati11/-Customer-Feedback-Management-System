const express = require("express");
const router = express.Router();
const db = require("../db");

// ==========================
// GET ALL FEEDBACK
// ==========================
router.get("/feedback", (req, res) => {

    const sql = "SELECT * FROM feedback ORDER BY feedback_id DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("GET Error:", err);
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json(results);

    });

});


// ==========================
// INSERT FEEDBACK
// ==========================
router.post("/feedback", (req, res) => {

    const { customer_id, product_id, feedback_text, sentiment } = req.body;

    const sql = `
        INSERT INTO feedback
        (customer_id, product_id, feedback_text, feedback_date, sentiment)
        VALUES (?, ?, ?, CURDATE(), ?)
    `;

    db.query(
        sql,
        [customer_id, product_id, feedback_text, sentiment],
        (err, result) => {

            if (err) {
                console.error("POST Error:", err);
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Feedback added successfully",
                id: result.insertId
            });

        }
    );

});


// ==========================
// UPDATE FEEDBACK
// ==========================
router.put("/feedback/:id", (req, res) => {

    const id = req.params.id;

    const {
        customer_id,
        product_id,
        feedback_text,
        sentiment
    } = req.body;

    const sql = `
        UPDATE feedback
        SET
            customer_id = ?,
            product_id = ?,
            feedback_text = ?,
            sentiment = ?
        WHERE feedback_id = ?
    `;

    db.query(
        sql,
        [
            customer_id,
            product_id,
            feedback_text,
            sentiment,
            id
        ],
        (err, result) => {

            if (err) {
                console.error("PUT Error:", err);
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Feedback updated successfully"
            });

        }
    );

});


// ==========================
// DELETE FEEDBACK
// ==========================
router.delete("/feedback/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM feedback WHERE feedback_id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error("DELETE Error:", err);
            return res.status(500).json({
                success: false,
                message: "Delete failed"
            });
        }

        res.json({
            success: true,
            message: "Feedback deleted successfully"
        });

    });

});


module.exports = router;