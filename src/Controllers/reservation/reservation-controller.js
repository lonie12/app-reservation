let {PrismaClient} = require('@prisma/client')
let dayJs = require('dayjs')
let Prisma = new PrismaClient()
let qrcode = require('qrcode')

// Code = reservation.id + " " + reservation.user + " " + reservation.voyage
// Code Split = [res.id, res.user, res.voyage]

class Reservation {

    constructor({codex, nombre}) {
        this.code = codex
        this.nombre = nombre
    }
    
    async reserve (request, response) {
        let vid = request.params.id
        let totals = 0
        // Find Travel with id in params
        let voyage = await Prisma.voyage.findUnique({
            where: {
                id: vid
            }
        })
        // If Exists make actions
        if(voyage && voyage.etat) {
            let reservations = await Prisma.reservation.findMany({
                where: {
                    voyage: vid
                }
            })
            reservations.forEach(reservation => {
                totals += reservation.nombre
            })
            totals +=  parseInt(this.nombre)
            if(totals <= voyage.total) {
                let reservation = await Prisma.reservation.create({
                    data: {
                        date: dayJs(new Date()).toDate(),
                        voyage: vid,
                        user: request.user.id,
                        nombre: parseInt(this.nombre),
                        code: '',
                    },
                })
                if(reservation) {
                    let code = reservation.id + " " + reservation.user + " " + reservation.voyage
                    code = await qrcode.toDataURL(code)
                    reservation = await Prisma.reservation.update({
                        where: {
                            id: reservation.id
                        },
                        data: {
                            code: code
                        },
                        include: {
                            voyages: {
                                include: {
                                    users: true
                                }
                            }
                        }
                    })
                    await Prisma.voyage.update({
                        data: {
                            prise: totals
                        },
                        where: {
                            id: voyage.id
                        },
                    })
                    response.status(201).json({
                        reservation: {
                            id: reservation.id,
                            date: reservation.date,
                            code: reservation.code,
                            status: reservation.status,
                            nombre: reservation.nombre,
                            user: reservation.user,
                            voyage: reservation.voyage
                        },
                        voyage: reservation.voyages
                    })
                } else {
                    response.status(403).json({
                        error: "Couldn't create"
                    })
                }
            } else {
                response.status(402).json({
                    places: totals,
                    error: "No more space available"
                })
            }
        //Indisponible
        } else {
            response.status(404).json({
                error: 'Indisponible'
            })
        }

    }

    async cancel(request, response) {
        if(request.params.id) {
            let id = request.params.id
            let reservation = await Prisma.reservation.findUnique({
                where: {
                    id: id
                }
            })
            if(reservation) {
                reservation = await Prisma.reservation.update({
                    where: {
                        id: id
                    },
                    data: {
                        status: false
                    }
                })
                if(reservation) {
                    response.status(200).json(reservation)
                }
            }
        }
    }

    async codeVerification(request, response) {

        if(!this.code) {

            response.status(404).json({
                error: 'Not allowed',
                code: false
            })
        }
        let code = this.code.split(' ')

        if(!code || code.length != 3) {
            response.status(403).json({
                code: false,
                error: "Invalid code"
            })
        }
        let reservation = await Prisma.reservation.findUnique({
            where: {
                id: code[0]
            }
        })
        if(reservation && (reservation.status)) {
            if(reservation.user == code[1] && reservation.voyage == code[2]) {
                let voyage = await Prisma.voyage.findUnique({
                    where: {
                        id: code[2]
                    },
                    include: {
                        users: true
                    }
                })
                let user = await Prisma.user.findUnique({
                    where: {
                        id: code[1]
                    }
                })
                let vCreator = request.user.id
                if(user && voyage && (voyage.user == vCreator)) {
                    reservation = await Prisma.reservation.update({
                        where: {
                            id: code[0]
                        },
                        data: {
                            status: false
                        }
                    })
                    response.status(200).json({
                        message: "Valid for " + reservation.nombre + " person (s)",
                        code: true
                    })
                } else {
                    response.status(200).json({
                        error: 'Not linked|Not Company',
                        code: false
                    })
                }
            } else {
                response.status(403).json({
                    error: 'Invalid code',
                    code: false
                })
            }
        } else {
            response.status(404).json({
                error: 'Not_found|already_used|canceled',
                code: false
            })
        }
    }

    async getAllReservations(response) {

        let reservations = await Prisma.reservation.findMany({})

        if(reservations) {

            response.status(200).json(reservations)
        }
    }

    async getReservationById(request, response) {

        if(request.params.id) {

            let reservation = await Prisma.reservation.findUnique({
                where: {
                    id: request.params.id
                }
            })

            if(reservation) {

                response.status(200).json(reservation)
            }
        }
    }

    async getCompanyReservations(request, response) {

        let reservations = await Prisma.reservation.findMany({
            where: {
                voyages: {
                    user: request.user.id
                }
            },
            include: {
                users: true,
                voyages: true
            }
        })

        if(reservations) {

            response.status(200).json(reservations)
        }
    }

    async getCompanyReservationById(request, response) {

        if(request.params.id) {

            let reservation = await Prisma.reservation.findUnique({
                where: {
                    id: request.params.id
                }
            })

            if(reservation) {

                reservation = await Prisma.reservation.findFirst({
                    where: {
                        user: request.user.id
                    }
                })

                response.status(200).json(reservation)
            }
        }
    }
}

module.exports = Reservation