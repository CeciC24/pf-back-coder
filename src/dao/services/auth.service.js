import UsersModel from '../mongo/models/users.model.js'
import { isValidPassword, generateToken } from '../../utils.js'
import UserManager from '../mongo/users.mongo.js'
import config from '../../config/environment.config.js'

const userMngr = new UserManager()

export default class AuthManager {
	constructor() {}

	async login({ email, password }) {
		if (!email || !password) {
			throw new Error('Faltan datos')
		}
		
		if (email === config.adminEmail && password === config.adminPassword) {
			const admin = {
				first_name: 'Coder',
				last_name: 'House',
				email: email,
				age: 10,
				role: 'admin',
			}
			const token = generateToken(admin)
			return { message: 'Autenticacion exitosa', token }
		}

		const user = await UsersModel.findOne({ email })
		if (!user) {
			throw new Error('Error de credenciales')
		}

		const valid = isValidPassword(user, password)
		if (!valid) {
			throw new Error('Error de credenciales')
		}

		const token = generateToken(user)
		return { message: 'Autenticacion exitosa', token }
	}

	async register({ first_name, last_name, email, age, password }) {
		if (!first_name || !last_name || !email || !age || !password) {
			throw new Error('Faltan datos')
		}
		
		const user = await UsersModel.findOne({ email })
		if (user) {
			throw new Error('El correo ya se encuentra registrado')
		}

		const newUser = {
			first_name,
			last_name,
			email,
			age,
			password,
		}

		const userCreated = await userMngr.create(newUser)

		const token = generateToken(userCreated)
		return { message: 'Registro exitoso', token }
	}

	async restore({ email, password }) {
		if (!email || !password) {
			throw new Error('Faltan datos')
		}

		const user = await UsersModel.findOne({ email })
		if (!user) {
			throw new Error('Error de credenciales')
		}

		const updatedUser = await userMngr.update(user._id, { password: password })
		const token = generateToken(updatedUser)
		return { message: 'Contraseña restaurada', token }
	}
}
