let {PrismaClient} = require('@prisma/client')
let jwt = require('jsonwebtoken')
let Prisma = new PrismaClient()
let bcrypt = require('bcrypt')

// Instance of Users
class User {

    constructor({nom, prenom, email, telephone, password, role, logo}) {
        this.nom = nom
        this.prenom = prenom
        this.email = email
        this.telephone = telephone
        this.password = password
        this.logo = logo
        this.role = "isCompany"
    }

    // Login Function Allow User connect to the app
    async login(response) {

        if(!(this.email && this.password)) {
            
            response.status(404).json({
                error: 'All fields are required'
            })
        } else {

            let user = await Prisma.user.findFirst({
                where: {
                    email: this.email
                }
            })

            if(user && (await bcrypt.compare(this.password, user.password))) {
                
                user.password = ''
                user.logo = ''
                user.token = jwt.sign(user, process.env.JWT_SECRET)
                response.status(200).json(user)
            } else {
    
                response.status(200).json({
                    error: 'Invalid credentials'
                })
            }
        }
    }


    // Register function allow user register as new User
    async register(response) {

        // Control user inputs
        if(!(this.nom && this.prenom && this.email && this.password && this.telephone)) { 

            response.status(401).json({
                error: 'All fields are required'
            })
        } else {

            // FInd if users exists
            let user = await Prisma.user.findFirst({
                where: {
                    email: this.email
                }
            })

            if(user) {

                response.status(403).json({
                    error: 'User already exists'
                })
            } else {

                // Find if telephone already on use
                user = await Prisma.user.findFirst({
                    where: {
                        telephone: this.telephone
                    }
                })

                if(user) {

                    response.status(403).json({
                        error: 'This number already on use'
                    })
                } else {

                    let pass = await bcrypt.hash(this.password, 12)
                    
                    // create the user
                    user = await Prisma.user.create({
                        data: {
                            nom: this.nom,
                            prenom: this.prenom,
                            email: this.email,
                            telephone: this.telephone,
                            password: pass,
                            logo: ''
                        }
                    })

                    response.status(201).json(user)
                }
            }
        }
    }

    // Add a company 
    async addCompany(request, response) {

        if(!(this.nom && this.email && this.telephone && this.password)) {
            response.status(401).json({
                error: 'Fields required'
            })
        } else {
            let company = await Prisma.user.findFirst({
                where: {
                    email: this.email
                }
            })
            if(company) {
                
                response.status(302).json({
                    error: 'Email already on use'
                })
            } else {
                company = await Prisma.user.findFirst({
                    where: {
                        telephone: this.telephone
                    }
                })
                if(company) {
                    response.status(302).json({
                        error: 'Telephone already on use'
                    })
                } else {
                    if(request.files) {
                        if(request.files.logo) {
                            this.logo = Buffer.from(request.files.logo.data).toString('base64')
                        }
                    }
                    let pass = await bcrypt.hash(this.password, 12)
                    let company = await Prisma.user.create({
                        data: {
                            nom: this.nom,
                            email: this.email,
                            telephone: this.telephone,
                            password: pass,
                            role: this.role,
                            logo: this.logo ? this.logo : "null"
                        }   
                    })

                    if(company) {
                        response.status(201).json(company)
                    }
                }
            }
        }
    }
}

// Export default User Class
module.exports = User