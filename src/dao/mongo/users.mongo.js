import { createHash } from '../../utils.js'
import UsersModel from './models/users.model.js'

export default class UserManager {
	constructor() {}

	async get() {
		const response = await UsersModel.find()
		return response
	}

	async getById(id) {
		const response = await UsersModel.findById(id)
		return response
	}

	async create(userData) {
		try {
			userData.password = createHash(userData.password)
			const response = await UsersModel.create(userData)
			return response
		} catch (error) {
			console.error(error.message)
		}
	}

	async update(id, userData) {
		if (userData.password) {
			userData.password = createHash(userData.password)
		}
		await UsersModel.updateOne({ _id: id }, { $set: userData })
		const response = await UsersModel.findById(id)
		return response
	}

	async delete(id) {
		const response = await UsersModel.findByIdAndDelete(id)
		return response
	}

	async getAllWithCart() {
		try {
			const users = await UsersModel.find().populate('cart.product')
			return users
		} catch (error) {
			console.log('Error al obtener los usuarios con carritos')
		}
	}

	async getPaginated(page, limit, sort, query) {
		try {
			const options = {
				page: page || 1,
				limit: limit || 10,
				sort: sort ? { price: sort } : null,
			}
			const result = await UsersModel.paginate(query, options)
			
			// const users = paginateFormat(result, '/users')
			return result
		} catch (error) {
			throw new Error('Error al obtener usuarios paginados')
		}
	}
}
