import TicketsRepository from "../../repositories/tickets.repository.js";

export default class TicketsManager {
    constructor() {
        this.repository = new TicketsRepository()
    }

    async create(newTicket) {
        return await this.repository.create(newTicket)
    }

    async get() {
        return await this.repository.find()
    }

    async getById(id) {
        return await this.repository.findById(id)
    }
}