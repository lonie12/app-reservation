// Requires
let express = require('express')
let upload = require('express-fileupload')
let cors = require('cors')

// Express App
let app = express()


// Constantes
const origin = "*"

//Middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(upload())
app.use(cors({
    origin: origin
}))

// users endpoint access users controllers
app.use('/users', require('./src/Controllers/user/user-services'))

// voyage
app.use('/voyages', require('./src/Controllers/voyage/voyage-services'))

// Reservation
app.use('/reservations', require('./src/Controllers/reservation/reservation-services'))

app.get('/api', (request, response) => {

    response.json({
        message: "hello"
    })
})


// backend app listen on 
app.listen(process.env.PORT || 3000)