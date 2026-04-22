const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/add-ticket', async (req, res) => {
    const[concerts] = await pool.query('SELECT CONCERT_ID, VENUE_NAME FROM CONCERT')
    const[customers] = await pool.query('SELECT CUSTOMER_ID, CUSTOMER_NAME FROM CUSTOMER')
    res.send(`
        <html>
            <head>
                <style>
                    .error-input { border: 2px solid red; }
                    .error-text { color: red; font-size: 0.8em; }
                    .nav-link { margin-top: 20px; display: block; }
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
                <form action= "/add-ticket" method= "POST">
                    <label for="concert_id">Select Concert:</label><br>
                    <select id="concert_id" name="concert_id" required>
                        ${concerts.map(concert =>
                            `<option value="${concert.CONCERT_ID}">${concert.VENUE_NAME}</option>`
                        ).join(' ')}
                    </select><br><br>

                    <label for="customer_id">Select Customer:</label><br>
                    <select id="customer_id" name="customer_id" required>
                        ${customers.map(customer =>
                            `<option value="${customer.CUSTOMER_ID}">${customer.CUSTOMER_NAME}</option>`
                        ).join(' ')}
                    </select><br><br>

                    <label for= "seat_number">Seat Number:</label><br>
                    <input type= "number" id= "seat_number" name= "seat_number" required><br><br>

                    <label for= "price">Price:</label><br>
                    <input type= "number" step= "0.01" min= "0" id= "price" name= "price" required><br><br>

                    <input type="submit" value="Add Ticket">
                </form>
                <a href="/" class="nav-link">Back to Home</a>
            </body>
        </html>
    `)
})

router.post('/add-ticket', async (req, res) => {
    const { concert_id, customer_id, seat_number, price } = req.body

    if (!concert_id || !customer_id || !seat_number || !price) {
        console.log('Validation error: One or more fields are empty')
        return res.redirect('/add-ticket?error=missing')
    }

    try {
        const[result] = await pool.query(`
        INSERT INTO TICKET (CONCERT_ID, CUSTOMER_ID, SEAT_NUMBER, PRICE)
        VALUES (?, ?, ?, ?)`, 
        [concert_id, customer_id, seat_number, price])

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
                    <h2>Ticket added successfully.</h2>
                    <a href='/'>Back to Home</a>
                </body>
            </html>    
        `)
    } catch (err) {
        console.log(err)
        res.status(500).send('Database error.')
    }
})
//------------------------------------------------------------------------------------------
router.get('/total-spending-per-customer', async (req, res) => {
    const [customers] = await pool.query(`
        SELECT CUSTOMER_ID, CUSTOMER_NAME
        FROM CUSTOMER
    `)

    let tickets = []
    if (req.query.customer_id) {
        [tickets] = await pool.query(`
            SELECT CUSTOMER.CUSTOMER_ID, CUSTOMER.CUSTOMER_NAME, SUM(TICKET.PRICE) AS TOTAL_SPENT
            FROM TICKET
            JOIN CUSTOMER ON CUSTOMER.CUSTOMER_ID = TICKET.CUSTOMER_ID
            WHERE TICKET.CUSTOMER_ID = ?
            GROUP BY CUSTOMER.CUSTOMER_ID, CUSTOMER.CUSTOMER_NAME
        `, [req.query.customer_id])
    } else {
        [tickets] = await pool.query(`
            SELECT CUSTOMER.CUSTOMER_ID, CUSTOMER.CUSTOMER_NAME, SUM(TICKET.PRICE) AS TOTAL_SPENT
            FROM TICKET
            JOIN CUSTOMER ON CUSTOMER.CUSTOMER_ID = TICKET.CUSTOMER_ID
            GROUP BY CUSTOMER.CUSTOMER_ID, CUSTOMER.CUSTOMER_NAME
        `)
    }

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
            <form action="/total-spending-per-customer" method= "GET">
                    <label for= "customer_id">Select Customer:</label><br>
                        <select id= "customer_id" name= "customer_id">
                            <option value="" selected>--All Customers--</option>
                            ${customers.map(customers =>
                                `<option value="${customers.CUSTOMER_ID}">${customers.CUSTOMER_NAME}</option>`
                            ).join('')}
                        </select><br><br>
                    <input type= "submit" value= "View Prices">
                </form>
                ${tickets.length > 0 ? `
                    <h3>${req.query.customer_id ? `Total spent by ${tickets[0].CUSTOMER_NAME}` : 'Total spent by All Customers'}</h3>
                    <table border= "1">
                        <tr>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Total Spent</th>
                        </tr>
                        ${tickets.map(tickets => `
                            <tr>
                                <td>${tickets.CUSTOMER_ID}</td>
                                <td>${tickets.CUSTOMER_NAME}</td>
                                <td>${tickets.TOTAL_SPENT}</td>
                            </tr>
                            `).join('')}
                    </table>    
                ` : ''}
                <a href='/'>Back to Home</a>
            </body>
        </html>
    `)
})
//------------------------------------------------------------------------------------------
router.get('/top-artists', async (req, res) => {
    const [topArtists] = await pool.query(`
        SELECT ARTIST.ARTIST_NAME, SUM(TICKET.PRICE) AS TOTAL_SPENT
        FROM TICKET
        JOIN CONCERT ON CONCERT.CONCERT_ID = TICKET.CONCERT_ID
        JOIN ARTIST ON ARTIST.ARTIST_ID = CONCERT.ARTIST_ID
        GROUP BY ARTIST.ARTIST_ID, ARTIST.ARTIST_NAME
        ORDER BY TOTAL_SPENT DESC
        LIMIT 3
    `)

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
                ${topArtists.length > 0 ? `
                    <h3>Top 3 Artists Based on Revenue</h3>
                    <table border= "1">
                        <tr>
                            <th>Artist Name</th>
                            <th>Total Revenue</th>
                        </tr>
                        ${topArtists.map(topArtists => `
                            <tr>
                                <td>${topArtists.ARTIST_NAME}</td>
                                <td>${topArtists.TOTAL_SPENT}</td>
                            </tr>
                            `).join('')}
                    </table>    
                ` : ''}
                <a href='/'>Back to Home</a>
            </body>
        </html>
    `)
})
module.exports = router;