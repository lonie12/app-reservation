let {PrismaClient} = require('@prisma/client')
let Prisma = new PrismaClient()
let dayJS = require('dayjs')

class Voyage {

    constructor({date, depart, origine, destination, total, price, arrive, difference}) {
        this.date = date
        this.depart = depart
        this.origine = origine
        this.destination = destination
        this.total = parseInt(total)
        this.price = parseInt(price)
        this.arrive = arrive
        this.difference = difference
    }

    dateTimeLocationConfig() {
        let date = dayJS(this.date).toDate()
        let timeDepart = this.depart.replace('%3A', ':') // Time depart to date + time
        timeDepart = dayJS(this.date + 'T' + timeDepart).toDate()
        let timeArrive = this.arrive.replace('%3A', ':') // Time Arrive to date + time
        timeArrive = dayJS(this.date + 'T' + timeArrive).toDate()
        this.difference = dayJS((new Date(timeArrive)) - (new Date(timeDepart))).toDate()
        this.depart = timeDepart
        this.arrive = timeArrive
        this.date = date
    }

    async initialize(request, response) {
        if(!(this.date, this.depart, this.origine, this.destination, this.total, this.arrive, this.price)) {
            response.status(403).json({
                error: 'All fields are required'
            })
        } else {
            this.dateTimeLocationConfig()
            let today = parseInt((new  Date()).getTime())
            if((new Date(this.date)).getTime() < today || (new Date(this.arrive)) <= (new Date(this.depart)) ) {
                return response.status(403).json({
                    error: 'Incorrect date-time'
                })
            } else if(this.origine == this.destination) {
                response.status(403).json({
                    error: 'Same location not allowed'
                })
            } else {
                let voyage = await Prisma.voyage.create({
                    data: {
                        date: this.date,
                        depart: this.depart,
                        origine: this.origine,
                        destination: this.destination,
                        total: this.total,
                        difference: this.difference,
                        arrive: this.arrive,
                        price: this.price,
                        user: request.user.id,
                    },
                })
                response.status(201).json(voyage)
            }
        }
    }

    async edit(request, response) {
        let id = request.params.id
        let voyage = await Prisma.voyage.findUnique({
            where: {
                id: id
            }
        })
        if(voyage) {
            if(!(this.date, this.depart, this.origine, this.destination, this.total, this.arrive, this.price)) {
                response.status(403).json({
                    error: 'All fields are required'
                })
            } else {
                this.dateTimeLocationConfig()
                let today = parseInt((new  Date()).getTime())
                if((new Date(this.date)).getTime() < today || (new Date(this.arrive)) <= (new Date(this.depart)) ) {
                    return response.status(403).json({
                        error: 'Incorrect date-time'
                    })
                } else if(this.origine == this.destination) {
                    response.status(403).json({
                        error: 'Same location not allowed'
                    })
                } else {
                    voyage = await Prisma.voyage.update({
                        where: {
                            id: id
                        },
                        data: {
                            date: this.date,
                            depart: this.depart,
                            origine: this.origine,
                            destination: this.destination,
                            total: this.total,
                            difference: this.difference,
                            arrive: this.arrive,
                            price: this.price,
                            user: request.user.id,
                        }
                    })
                    if(voyage) {
                        response.status(200).json(voyage)
                    }
                }
            }
        } else {
            response.status(404).json({
                error: 'Not Found'
            })
        }
    } 

    async cancel(request, response) {
        let id = request.params.id
        let voyage = await Prisma.voyage.findUnique({
            where: {
                id: id
            }
        })
        if(!voyage) {

            response.status(404).json({
                error: 'Not Found'
            })
        } else {
            voyage = await Prisma.voyage.update({
                where: {
                    id: id
                }, 
                data: {
                    etat: false
                }
            })
            response.status(200).json(voyage)
        }
    }

    async getAll(request, response) {
        let page = request.query.page
        // console.log(page)
        // let voyages = await Prisma.voyage.findMany({
        //     include: {
        //         users: true
        //     },
        //     where: {
        //         etat: true
        //     }
        // })
        // if(voyages) {
        //     response.status(200).json(voyages)
        // }
    } 

    async getById(request, response) {
        if(request.params.id) {

            let voyage = await Prisma.voyage.findUnique({
                where: {
                    id: request.params.id
                }
            })
            if(voyage) {

                response.status(200).json(voyage)
            }
        }
    
    }

    async getCompanyVoyages(request, response) {
        let voyages = await Prisma.voyage.findMany({
            where: {
                user: request.user.id
            }
        })
        if(voyages) {
            response.status(200).json(voyages)
        }
    }

    async getCompanyVoyagesById() {
        let voyage = await Prisma.voyage.findFirst({
            where: {
                id: request.params.id,
                user: request.user.id
            }
        })
        if(voyage) {
            response.status(200).json(voyage)
        }
    }
}


module.exports = Voyage