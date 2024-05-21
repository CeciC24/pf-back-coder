import MessagesModel from "./models/messages.model.js"

class MessagesManager {
	constructor() {}

	async addMessage(newMessage) {
		let response = await MessagesModel.create(newMessage)
		return response
	}

	async getMessages() {
		let response = await MessagesModel.find()
		return response
	}

	async getMessageById(id) {
		let response = await MessagesModel.findById(id)
        return response
	}
}

export default MessagesManager
