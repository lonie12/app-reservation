let express = require('express')
let router = express.Router()
let Reservation = require('./reservation-controller')
let auth = require('../../helpers/auth')

// Reservation create
router.post('/create/:id', [auth.verify, auth.isPublicOrAdmin], create)

// Code validation
router.post('/validation', [auth.verify, auth.isCompany], validation)

// Cancel a reservation
router.post('/cancel/:id', [auth.verify, auth.isPublic], cancel)

// Get All reservations
router.get('/all', [auth.verify, auth.isAdmin], getAll)

// Get reservation by Id
router.get('/first/:id', [auth.verify, auth.isAdmin], getById)

// Get company reservation by Id
router.get('/company-first/:id', [auth.verify, auth.isCompanyOrAdmin], getResCompanyById)

// Get company all reservation by Id
router.get('/company-all', [auth.verify, auth.isCompanyOrAdmin], getResCompanyAll)


module.exports = router

function validation(request, response) {

    let reservation = new Reservation(request.body)

    reservation.codeVerification(request, response)
}

function create(request, response) {

    let reservation = new Reservation(request.body)

    reservation.reserve(request, response)
}

function cancel(request, response) {

    let reservation = new Reservation({})

    reservation.cancel(request, response)
}

function getAll(request, response) {

    let reservation = new Reservation({})

    reservation.getAllReservations(response)
}

function getById(request, response) {

    let reservation = new Reservation({})

    reservation.getReservationById(request, response)
}

function getResCompanyAll(request, response) {

    let reservation = new Reservation({})

    reservation.getCompanyReservations(request, response)
}

function getResCompanyById(request, response) {

    let reservation = new Reservation({})

    reservation.getCompanyReservationById(request, response)
}