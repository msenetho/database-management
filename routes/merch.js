const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/merch-revenue', async (req, res) => {
    const { rows: revenue } = await pool.query(`
        SELECT artist.artist_name, concert.venue_name, SUM(merch_price * quantity_sold) AS total_revenue
        FROM merchandise
        JOIN concert ON concert.concert_id = merchandise.concert_id
        JOIN artist ON artist.artist_id = merchandise.artist_id
        GROUP BY artist.artist_name, concert.venue_name
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
                ${revenue.length > 0 ? `
                    <h3> Merch Revenue Per Artist</h3>
                    <table border="1">
                        <tr>
                            <th>Artist</th>
                            <th>Venue</th>
                            <th>Total Revenue</th>
                        </tr>
                        ${revenue.map(row => `
                            <tr>
                                <td>${row.artist_name}</td>
                                <td>${row.venue_name}</td>
                                <td>${row.total_revenue}</td>
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