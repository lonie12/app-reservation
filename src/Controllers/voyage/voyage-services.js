let express = require('express')
let auth = require('../../helpers/auth')
let Voyage = require('./voyage-controller')

let router = express.Router()

// Create voyage
router.post('/create', [auth.verify, auth.isCompany], initialize)

// Update voyage Cancel
router.put('/cancel/:id', [auth.verify, auth.isCompany], cancel)

// Update voyage Edit
router.put('/edit/:id', [auth.verify, auth.isCompany], edit)

// Get all voyages
router.get('/all', getAll)

// Get Voyage by his Id
router.get('/first/:id', [auth.verify, auth.isAdmin], getById)

// Get Company voyages
router.get('/company-voyages', [auth.verify, auth.isCompany], getByCompany)

// Get Company voyages with id
router.get('/company-voyages/:id', [auth.verify, auth.isCompany], getByCompanyId)

// Export default
module.exports = router

function initialize(request, response) {

    let voyage = new Voyage(request.body)
    
    voyage.initialize(request, response)
}

function cancel(request, response) {

    let voyage = new Voyage({})

    voyage.cancel(request, response)
}

function getAll(request, response) {

    let voyage = new Voyage({})

    voyage.getAll(request, response)
}

function getById(request, response) {

    let voyage = new Voyage({})

    voyage.getById(request, response)
}

function getByCompany(request, response){

    let voyage = new Voyage({})
    voyage.getCompanyVoyages(request, response)
} 

function getByCompanyId(request, response){

    let voyage = new Voyage({})
    voyage.getCompanyVoyagesById(request, response)
} 

function edit(request, response) {

    let voyage = new Voyage(request.body)
    voyage.edit(request, response)
}