import { Router } from 'express'
import MessagesManager from '../dao/mongo/messages.mongo.js'
import MessageDTO from '../dao/DTOs/message.dto.js'

const MsgManager = new MessagesManager()
const MessagesRouter = Router()

MessagesRouter.get('/', async (req, res) => {
	try {
		res.status(200).send(await MsgManager.get())
	} catch (error) {
		res.status(500).send({ error: 'Error al obtener mensajes' })
	}
})

MessagesRouter.get('/:mid', async (req, res) => {
	let mid = req.params.mid

	try {
		res.status(200).send(await MsgManager.getById(mid))
	} catch (error) {
		res.status(404).send({ error: 'Mensaje no encontrado' })
	}
})

MessagesRouter.post('/', async (req, res) => {
	let messageData = req.body

	try {
		const newMessage = new MessageDTO(messageData)
		res.status(200).send(await MsgManager.create(newMessage))
	} catch (error) {
		res.status(500).send({ error: 'Error al agregar mensaje' })
	}
})

export default MessagesRouter
