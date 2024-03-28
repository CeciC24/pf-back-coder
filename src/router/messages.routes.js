import { Router } from 'express';
import MessagesManager from '../dao/services/MessagesManager.js';

const MsgManager = new MessagesManager()
const MessagesRouter = Router()

MessagesRouter.get("/", async (req, res) => {
    try {
        res.status(200).send(await MsgManager.getMessages())
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener mensajes' })
    }
})

MessagesRouter.get("/:mid", async (req, res) => {
    let mid = req.params.mid

    try {
        res.status(200).send(await MsgManager.getMessageById(mid))
    } catch (error) {
        res.status(404).send({ error: 'Mensaje no encontrado' })
    }
})

MessagesRouter.post("/", async (req, res) => {
    let newMessage = req.body

    try {
        res.status(200).send(await MsgManager.addMessage(newMessage))
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar mensaje' })
    }
})


export default MessagesRouter