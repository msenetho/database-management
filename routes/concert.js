const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/add-concert', async (req, res) => {
    const [artists] = await pool.query('SELECT ARTIST_ID, ARTIST_NAME FROM ARTIST')
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
                <form action= "/add-concert" method= "POST">
                    <label for= "venue_name">Venue Name:</label><br>
                        <input type= "text" id= "venue_name" name= "venue_name" required><br><br>
                    
                    <label for= "city">City:</label><br>
                        <input type= "text" id= "city" name= "city" required><br><br>

                    <label for= "concert_date">Concert Date:</label><br>
                        <input type= "date" id= "concert_date" name= "concert_date" required><br><br>

                    <label for= "artist_id">Select Artist:</label><br>
                        <select id= "artist_id" name= "artist_id" required>
                            <option value="" disabled selected>--Select an Artist--</option>
                            ${artists.map(artist =>
                                `<option value="${artist.ARTIST_ID}">${artist.ARTIST_NAME}</option>`
                            ).join('')}
                        </select><br><br>
                    
                    <input type="submit" value="Add Concert">
                </form>
                <a href= "/" class= "nav-link">Back to Home</a>
            </body>
        </html>
    `)
})
router.post('/add-concert', async (req, res) => {
    const { venue_name, city, concert_date, artist_id } = req.body

    if (!venue_name || !city || !concert_date || !artist_id) {
        console.log('Validation error: One or more fields are empty')
        return res.redirect('/add-concert?error=missing')
    }

    try {
        const[result] = await pool.query(`INSERT INTO CONCERT (VENUE_NAME, CITY, CONCERT_DATE, ARTIST_ID) 
            VALUES (?, ?, ?, ?)`,
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
    const [concert_cities] = await pool.query('SELECT DISTINCT CITY FROM CONCERT')
    let concerts = []

    if (req.query.city) {
        [concerts] = await pool.query(`
        SELECT * FROM CONCERT
        WHERE CITY = ?
        `, [req.query.city])
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
                <form action= "/view-concerts" method= "GET">
                    <label for= "city">Select City:</label><br>
                        <select id= "city" name= "city" required>
                            <option value="" disabled selected>--Select a City--</option>
                            ${concert_cities.map(cities =>
                                `<option value="${cities.CITY}">${cities.CITY}</option>`
                            ).join('')}
                        </select><br><br>
                    <input type= "submit" value= "View Concerts">
                </form>
                ${concerts.length > 0 ? `
                    <h3>Concerts in ${req.query.city}</h3>
                    <table border= "1">
                        <tr>
                            <th>Concert ID</th>
                            <th>Venue</th>
                            <th>City</th>
                            <th>Date</th>
                        </tr>
                        ${concerts.map(concert => `
                            <tr>
                                <td>${concert.CONCERT_ID}</td>
                                <td>${concert.VENUE_NAME}</td>
                                <td>${concert.CITY}</td>
                                <td>${concert.CONCERT_DATE}</td>
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
    const [artists] = await pool.query(`
        SELECT ARTIST_ID, ARTIST_NAME
        FROM ARTIST
    `)

    let concerts = []
    if (req.query.artist_id) {
        [concerts] = await pool.query(`
            SELECT * FROM CONCERT
            JOIN ARTIST ON CONCERT.ARTIST_ID = ARTIST.ARTIST_ID
            WHERE ARTIST.ARTIST_ID = ?
        `, [req.query.artist_id])
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
                <form action="/view-concert-from-artist" method= "GET">
                    <label for= "artist_id">Select Artist:</label><br>
                        <select id= "artist_id" name= "artist_id" required>
                            <option value="" disabled selected>--Select an Artist--</option>
                            ${artists.map(artists =>
                                `<option value="${artists.ARTIST_ID}">${artists.ARTIST_NAME}</option>`
                            ).join('')}
                        </select><br><br>
                    <input type= "submit" value= "View Concerts">
                </form>
                ${concerts.length > 0 ? `
                    <h3>Concerts for ${concerts[0].ARTIST_NAME}</h3>
                    <table border= "1">
                        <tr>
                            <th>Artist Name</th>
                            <th>Venue</th>
                            <th>City</th>
                            <th>Date</th>
                        </tr>
                        ${concerts.map(concert => `
                            <tr>
                                <td>${concert.ARTIST_NAME}</td>
                                <td>${concert.VENUE_NAME}</td>
                                <td>${concert.CITY}</td>
                                <td>${concert.CONCERT_DATE}</td>
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