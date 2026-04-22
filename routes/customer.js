const express = require('express')
const router = express.Router()
const pool = require('../db')

//GET
router.get('/add-customer', (req, res) => {
    res.send(`
        <html>
            <head>
                <style>
                    body {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                    }
                </style>
            </head>
            <body>
                <form action= "/add-customer" method= "POST">
                    <label for= "customer_name">Customer Name:</label><br>
                    <input type= "text" id= "customer_name" name="customer_name"><br><br>
                    <input type= "submit" value= "Add Customer">
                </form>
                <a href= "/" class= "nav-link">Back to Home</a>
            </body>
        </html>
    `)
})

//POST
router.post('/add-customer', async (req, res) => {
    const customer_name = req.body.customer_name
    await pool.query('INSERT INTO CUSTOMER (CUSTOMER_NAME) VALUES (?)', [customer_name])
    res.send(`
        <html>
            <head>
                <style>
                    body {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                    }
                </style>
            </head>
            <body>
                <h2>Customer added successfully.</h2>
                <a href='/'>Back to Home</a>
            </body>
        </html>    
    `)
})

module.exports = router;