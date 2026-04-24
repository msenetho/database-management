const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/add-ticket', async (req, res) => {
    const { rows: concerts } = await pool.query('SELECT concert_id, venue_name FROM concert')
    const { rows: customers } = await pool.query('SELECT customer_id, customer_name FROM customer')
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
                <form action="/add-ticket" method="POST">
                    <label for="concert_id">Select Concert:</label><br>
                    <select id="concert_id" name="concert_id" required>
                        ${concerts.map(concert =>
                            `<option value="${concert.concert_id}">${concert.venue_name}</option>`
                        ).join(' ')}
                    </select><br><br>

                    <label for="customer_id">Select Customer:</label><br>
                    <select id="customer_id" name="customer_id" required>
                        ${customers.map(customer =>
                            `<option value="${customer.customer_id}">${customer.customer_name}</option>`
                        ).join(' ')}
                    </select><br><br>

                    <label for="seat_number">Seat Number:</label><br>
                    <input type="number" id="seat_number" name="seat_number" required><br><br>

                    <label for="price">Price:</label><br>
                    <input type="number" step="0.01" min="0" id="price" name="price" required><br><br>

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
        await pool.query(`
        INSERT INTO ticket (concert_id, customer_id, seat_number, price)
        VALUES ($1, $2, $3, $4)`, 
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
    const { rows: customers } = await pool.query(`
        SELECT customer_id, customer_name
        FROM customer
    `)

    let tickets = []
    if (req.query.customer_id) {
        const { rows } = await pool.query(`
            SELECT customer.customer_id, customer.customer_name, SUM(ticket.price) AS total_spent
            FROM ticket
            JOIN customer ON customer.customer_id = ticket.customer_id
            WHERE ticket.customer_id = $1
            GROUP BY customer.customer_id, customer.customer_name
        `, [req.query.customer_id])
        tickets = rows
    } else {
        const { rows } = await pool.query(`
            SELECT customer.customer_id, customer.customer_name, SUM(ticket.price) AS total_spent
            FROM ticket
            JOIN customer ON customer.customer_id = ticket.customer_id
            GROUP BY customer.customer_id, customer.customer_name
        `)
        tickets = rows
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
            <form action="/total-spending-per-customer" method="GET">
                    <label for="customer_id">Select Customer:</label><br>
                        <select id="customer_id" name="customer_id">
                            <option value="" selected>--All Customers--</option>
                            ${customers.map(customer =>
                                `<option value="${customer.customer_id}">${customer.customer_name}</option>`
                            ).join('')}
                        </select><br><br>
                    <input type="submit" value="View Prices">
                </form>
                ${tickets.length > 0 ? `
                    <h3>${req.query.customer_id ? `Total spent by ${tickets[0].customer_name}` : 'Total spent by All Customers'}</h3>
                    <table border="1">
                        <tr>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Total Spent</th>
                        </tr>
                        ${tickets.map(ticket => `
                            <tr>
                                <td>${ticket.customer_id}</td>
                                <td>${ticket.customer_name}</td>
                                <td>${ticket.total_spent}</td>
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
    const { rows: topArtists } = await pool.query(`
        SELECT artist.artist_name, SUM(ticket.price) AS total_spent
        FROM ticket
        JOIN concert ON concert.concert_id = ticket.concert_id
        JOIN artist ON artist.artist_id = concert.artist_id
        GROUP BY artist.artist_id, artist.artist_name
        ORDER BY total_spent DESC
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
                    <table border="1">
                        <tr>
                            <th>Artist Name</th>
                            <th>Total Revenue</th>
                        </tr>
                        ${topArtists.map(artist => `
                            <tr>
                                <td>${artist.artist_name}</td>
                                <td>${artist.total_spent}</td>
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