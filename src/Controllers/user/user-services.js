let express = require('express')
let router = express.Router()
let User = require('./user-controller')
let auth = require('../../helpers/auth')


// Routes
router.post('/login', login)

router.post('/register', register)

router.post('/add-company', [auth.verify, auth.isAdmin] , addCompany)

// Fin Routes


//Export default 
module.exports = router


// Functions

// Login Function As Services call User Controller Function Login at src/Controllers/user/user-controller
function login(request, response) {

    let user = new User(request.body)

    user.login(response)
}

// Register Function As Services call User Controller Function register at src/Controllers/user/user-controller
function register(request, response) {

    let user = new User(request.body)

    user.register(response)
}

// Add new Company 
function addCompany(request, response) {

    let user = new User(request.body)

    user.addCompany(request, response)
} 

