const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET
router.get('/add-artist', (req, res) => {
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
                <form action="/add-artist" method="POST">
                    <label for="artist_name">Artist Name:</label><br>
                    <input type="text" id="artist_name" name="artist_name"><br><br>
                    <label for="genre_name">Genre:</label><br>
                    <input type="text" id="genre_name" name="genre_name"><br><br>
                    <input type="submit" value="Add Artist">
                </form>
                <a href="/" class="nav-link">Back to Home</a>
            </body>
        </html>
    `)
})

// POST
router.post('/add-artist', async (req, res) => {
    const artist_name = req.body.artist_name
    const genre_name = req.body.genre_name

    if (!artist_name || artist_name.trim() === '') {
        return res.status(400).send(`
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
                    <h2>Error: Artist name is required.</h2>
                    <a href='/add-artist'>Back to Add Artist</a>
                </body>
            </html>    
        `)
    }

    await pool.query(`
        INSERT INTO artist (artist_name, genre) 
        VALUES ($1, $2)`, 
        [artist_name, genre_name])
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
                <h2>Artist added successfully.</h2>
                <a href='/'>Back to Home</a>
            </body>
        </html>    
    `)
})

module.exports = router;