import TicketsModel from "./models/tickets.model.js";

export default class TicketsManager {
    constructor() {}

    async create(newTicket) {
        let response = await TicketsModel.create(newTicket);
        return response;
    }

    async get() {
        let response = await TicketsModel.find();
        return response;
    }

    async getById(id) {
        let response = await TicketsModel.findById(id);
        return response;
    }
}