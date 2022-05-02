let jwt = require('jsonwebtoken')

// Export default
module.exports = {

    //Function use to veify token
    verify: (request, response, next) => {
        let bearer = request.headers['authorization']
        if(typeof bearer != 'undefined') {
            if(bearer.indexOf("Bearer") == -1) {
                return response.status(401).json({
                    error: 'Invalid Token'
                })
            } else {
                let token = bearer.split(' ')[1]
                jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                    if(err) {
                        return response.status(401).json({
                            error: 'Invalid Token'
                        })
                    }
                    request.user = user
                    next()
                })
            }
        } else {
            return response.status(400).json({
                error: 'A token is required'
            })
        }
    },

    isCompany: (request, response, next) => {
        let user = request.user ? request.user : null
        if(user && user.role == "isCompany") {
            next()
        } else {
            return response.status(401).json({
                error: 'User not authorized'
            })
        }
    },

    isAdmin: (request, response, next) => {
        let user = request.user ? request.user : null
        if(user && user.role == "isAdmin") {
            next()
        } else {
            return response.status(401).json({
                error: 'User not authorized'
            })
        }
    },

    isPublic: (request, response, next) => {
        let user = request.user ? request.user : null
        if(user && user.role == "isPublic") {
            next()
        } else {
            return response.status(401).json({
                error: 'User not authorized'
            })
        }
    },
    
    isPublicOrAdmin: (request, response, next) => {
        let user = request.user ? request.user : null
        if(user && (user.role == "isPublic" || user.role == "isAdmin")) {
            next()
        } else {
            return response.status(401).json({
                error: 'User not authorized'
            })
        }
    },

    isCompanyOrAdmin: (request, response, next) => {
        let user = request.user ? request.user : null
        if(user && (user.role == "isCompany" || user.role == "isAdmin")) {
            next()
        } else {
            return response.status(401).json({
                error: 'User not authorized'
            })
        }
    }

}