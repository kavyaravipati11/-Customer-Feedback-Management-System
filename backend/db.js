const mysql = require("mysql2");

const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "***REMOVED_SECRET***",

    database: "customer_feedback"

});


db.connect((err) => {

    if (err) {

        console.error(
            "MySQL connection failed:",
            err
        );

        return;

    }

    console.log(
        "MySQL Connected"
    );

});


module.exports = db;