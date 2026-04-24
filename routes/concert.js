const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/add-concert', async (req, res) => {
    try {
        const { rows: artists } = await pool.query(`
            SELECT artist_id, artist_name
            FROM artist`)
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
                    <form action="/add-concert" method="POST">
                        <label for="venue_name">Venue Name:</label><br>
                            <input type="text" id="venue_name" name="venue_name" required><br><br>
                        
                        <label for="city">City:</label><br>
                            <input type="text" id="city" name="city" required><br><br>

                        <label for="concert_date">Concert Date:</label><br>
                            <input type="date" id="concert_date" name="concert_date" required><br><br>

                        <label for="artist_id">Select Artist:</label><br>
                            <select id="artist_id" name="artist_id" required>
                                <option value="" disabled selected>--Select an Artist--</option>
                                ${artists.map(artist =>
                                    `<option value="${artist.artist_id}">${artist.artist_name}</option>`
                                ).join('')}
                            </select><br><br>
                        
                        <input type="submit" value="Add Concert">
                    </form>
                    <a href="/" class="nav-link">Back to Home</a>
                </body>
            </html>
        `)
    } catch (err) {
        console.error(err)
        res.status(500).send('Database error.')
    }
})
router.post('/add-concert', async (req, res) => {
    const { venue_name, city, concert_date, artist_id } = req.body

    if (!venue_name || !city || !concert_date || !artist_id) {
        console.log('Validation error: One or more fields are empty')
        return res.redirect('/add-concert?error=missing')
    }

    try {
        await pool.query(`
            INSERT INTO concert (venue_name, city, concert_date, artist_id) 
            VALUES ($1, $2, $3, $4)`,
            [venue_name, city, concert_date, artist_id]
        )

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
                    <h2>Concert added successfully.</h2>
                    <a href='/'>Back to Home</a>
                </body>
            </html>
            `)
    } catch (err) {
        console.error(err)
        res.status(500).send('Database error.')
    }
})
// ------------------------------------------------------------------------------------------
router.get('/view-concerts', async (req, res) => {
    const { rows: concert_cities} = await pool.query(`
        SELECT DISTINCT city
        FROM concert`)
    let concerts = []

    if (req.query.city) {
        const { rows } = await pool.query(`
            SELECT * FROM concert
            WHERE city = $1`,
            [req.query.city])
        concerts = rows
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
                <form action="/view-concerts" method="GET">
                    <label for="city">Select City:</label><br>
                        <select id="city" name="city" required>
                            <option value="" disabled selected>--Select a City--</option>
                            ${concert_cities.map(city =>
                                `<option value="${city.city}">${city.city}</option>`
                            ).join('')}
                        </select><br><br>
                    <input type="submit" value="View Concerts">
                </form>
                ${concerts.length > 0 ? `
                    <h3>Concerts in ${req.query.city}</h3>
                    <table border="1">
                        <tr>
                            <th>Concert ID</th>
                            <th>Venue</th>
                            <th>City</th>
                            <th>Date</th>
                        </tr>
                        ${concerts.map(concert => `
                            <tr>
                                <td>${concert.concert_id}</td>
                                <td>${concert.venue_name}</td>
                                <td>${concert.city}</td>
                                <td>${concert.concert_date}</td>
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
router.get('/view-concert-from-artist', async (req, res) => {
    const { rows: artists } = await pool.query(`
        SELECT artist_id, artist_name
        FROM artist
    `)

    let concerts = []
    if (req.query.artist_id) {
        const { rows } = await pool.query(`
            SELECT * FROM concert
            JOIN artist ON concert.artist_id = artist.artist_id
            WHERE artist.artist_id = $1
        `, [req.query.artist_id])
        concerts = rows
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
                <form action="/view-concert-from-artist" method="GET">
                    <label for="artist_id">Select Artist:</label><br>
                        <select id="artist_id" name="artist_id" required>
                            <option value="" disabled selected>--Select an Artist--</option>
                            ${artists.map(artist =>
                                `<option value="${artist.artist_id}">${artist.artist_name}</option>`
                            ).join('')}
                        </select><br><br>
                    <input type="submit" value="View Concerts">
                </form>
                ${concerts.length > 0 ? `
                    <h3>Concerts for ${concerts[0].artist_name}</h3>
                    <table border="1">
                        <tr>
                            <th>Artist Name</th>
                            <th>Venue</th>
                            <th>City</th>
                            <th>Date</th>
                        </tr>
                        ${concerts.map(concert => `
                            <tr>
                                <td>${concert.artist_name}</td>
                                <td>${concert.venue_name}</td>
                                <td>${concert.city}</td>
                                <td>${concert.concert_date}</td>
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