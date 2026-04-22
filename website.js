const express = require('express')
const app = express()
const PORT = 3000

const pool = require('./db')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
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
                <h1>Music Database</h1>
                <ul>
                    <li><a href= "/add-artist">Add Artist</a></li>
                    <li><a href= "/add-concert">Add Concert</a></li>
                    <li><a href= "/view-concerts">View Concerts</a></li>
                    <li><a href= "/view-concert-from-artist">View Concerts from Artists</a></li>
                    <li><a href= "/add-customer">Add Customer</a></li>
                    <li><a href= "/add-ticket">Add Ticket</a></li>
                    <li><a href= "/top-artists">Top Artists</a></li>
                    <li><a href= "/total-spending-per-customer">Customer Spendings</a></li>
                    <li><a href= "/merch-revenue">(BONUS) Merch Revenue</a></li>
                </ul>
            </body>
        </html>    
    `)
})

const artistRoutes = require('./routes/artist')
app.use('/', artistRoutes)

const concertRoute = require('./routes/concert')
app.use('/', concertRoute)

const customerRoute = require('./routes/customer')
app.use('/', customerRoute)

const ticketRoute = require('./routes/ticket')
app.use('/', ticketRoute)

const merchRoute = require('./routes/merch')
app.use('/', merchRoute)

app.listen(PORT, () => {
    console.log(`Music Database listening on port ${PORT}`)
})