const express = require("express");
const router = express.Router();

const db = require("../db");


router.get("/reports", (req, res) => {

    const sql = `
        SELECT 
            product_id,
            COUNT(*) AS total_feedback,
            SUM(sentiment = 'Positive') AS positive,
            SUM(sentiment = 'Negative') AS negative,
            SUM(sentiment = 'Neutral') AS neutral
        FROM feedback
        GROUP BY product_id
    `;


    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        }

        res.json(result);

    });

});


module.exports = router;