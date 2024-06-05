import { Router } from 'express'
import passport from 'passport'
import UserManager from '../dao/mongo/users.mongo.js'
import UserDTO from '../dao/DTOs/user.dto.js'

const UsersRouter = Router()

const userManager = new UserManager()

// Obtener todos los usuarios
UsersRouter.get('/', async (req, res) => {
	try {
		const users = await userManager.get()
		res.status(200).json({ users })
	} catch (error) {
		console.error(`Error al cargar los usuarios: ${error}`)
		res.status(500).json({ error: `Error al recibir los usuarios` })
	}
})

// Obtener un usuario por su ID
UsersRouter.get('/:id', async (req, res) => {
	try {
		const { id } = req.params
		const user = await userManager.getById(id)
		if (user) {
			res.status(200).json({ user })
		} else {
			res.status(404).json({ error: `Usuario con id: ${id} no encontrado` })
		}
	} catch (error) {
		console.error(`Error al cargar el usuario: ${error}`)
		res.status(500).json({ error: `Error al recibir el usuario` })
	}
})

// Crear un nuevo usuario
UsersRouter.post('/', async (req, res) => {
	try {
		const userData = req.body
		const newUser = new UserDTO(userData)
		const result = await userManager.create(newUser)
		res.status(201).json({ result })
	} catch (error) {
		console.error(`Error al crear el usuario: ${error}`)
		res.status(500).json({ error: `Error al crear el usuario` })
	}
})

// Actualizar un usuario existente
UsersRouter.put('/:id', async (req, res) => {
	const { id } = req.params
	const updatedUser = req.body

	try {
		res.status(200).send(await userManager.update(id, updatedUser))
	} catch (error) {
		res.status(500).send({ error: 'Error al actualizar usuario: ' + error.message })
	}
})

// Eliminar un usuario por su ID
UsersRouter.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params
		const deletedUser = await userManager.delete(id)
		if (deletedUser) {
			res.status(200).json({ message: 'Usuario eliminado exitosamente' })
		} else {
			res.status(404).json({ error: 'Usuario no encontrado' })
		}
	} catch (error) {
		console.error(`Error al eliminar el usuario: ${error}`)
		res.status(500).json({ error: `Error al eliminar el usuario` })
	}
})

export default UsersRouter
