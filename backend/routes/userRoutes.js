const express = require("express");
const router = express.Router();
const db = require("../db");

// Register User
router.post("/register", (req, res) => {

    const { name, email, username, password } = req.body;

    const sql = `
        INSERT INTO users
        (name,email,username,password)
        VALUES(?,?,?,?)
    `;

    db.query(sql,
        [name,email,username,password],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Registration Successful"
            });

        });

});

// Login User
router.post("/login",(req,res)=>{

    const {username,password}=req.body;

    const sql=
    "SELECT * FROM users WHERE username=? AND password=?";

    db.query(sql,
        [username,password],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            if(result.length===0){

                return res.status(401).json({
                    message:"Invalid Username or Password"
                });

            }

            res.json({
                message:"Login Successful"
            });

        });

});

module.exports = router;