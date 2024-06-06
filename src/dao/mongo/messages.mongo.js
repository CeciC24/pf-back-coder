import MessagesRepository from "../../repositories/messages.repository.js"

export default class MessagesManager {
	constructor() {
        this.repository = new MessagesRepository()
    }

	async create(newMessage) {
		return await this.repository.create(newMessage)
	}

	async get() {
		return await this.repository.find()
	}

	async getById(id) {
		return await this.repository.findById(id)
	}
}