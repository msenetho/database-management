const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/merch-revenue', async (req, res) => {
    const[revenue] = await pool.query(`
        SELECT ARTIST.ARTIST_NAME, CONCERT.VENUE_NAME, SUM(MERCH_PRICE * QUANTITY_SOLD) AS TOTAL_REVENUE
        FROM MERCHANDISE
        JOIN CONCERT ON CONCERT.CONCERT_ID = MERCHANDISE.CONCERT_ID
        JOIN ARTIST ON ARTIST.ARTIST_ID = MERCHANDISE.ARTIST_ID
        GROUP BY ARTIST.ARTIST_NAME, CONCERT.VENUE_NAME
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
                    <table border= "1">
                        <tr>
                            <th>Artist</th>
                            <th>Venue</th>
                            <th>Total Revenue</th>
                        </tr>
                        ${revenue.map(revenue => `
                            <tr>
                                <td>${revenue.ARTIST_NAME}</td>
                                <td>${revenue.VENUE_NAME}</td>
                                <td>${revenue.TOTAL_REVENUE}</td>
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