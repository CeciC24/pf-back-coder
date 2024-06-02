import MessagesModel from "./models/messages.model.js"

class MessagesManager {
	constructor() {}

	async create(newMessage) {
		let response = await MessagesModel.create(newMessage)
		return response
	}

	async get() {
		let response = await MessagesModel.find()
		return response
	}

	async getById(id) {
		let response = await MessagesModel.findById(id)
        return response
	}
}

export default MessagesManager
