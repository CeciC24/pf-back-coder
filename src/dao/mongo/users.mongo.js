import { createHash } from '../../utils.js'
import UsersRepository from '../../repositories/users.repository.js'

export default class UserManager {
	constructor() {
        this.repository = new UsersRepository()
    }

	async get() {
		return await this.repository.find()
	}

	async getById(id) {
		return await this.repository.findById(id)
	}

	async create(userData) {
		try {
			userData.password = createHash(userData.password)
			return await this.repository.create(userData)
		} catch (error) {
			console.error(error.message)
		}
	}

	async update(id, userData) {
		if (userData.password) {
			userData.password = createHash(userData.password)
		}
		await this.repository.updateOne(id, userData)
		return await this.repository.findById(id)
	}

	async delete(id) {
		return await this.repository.findByIdAndDelete(id)
	}

	async getAllWithCart() {
		try {
			return await this.repository.getAllWithCart()
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
			// const users = paginateFormat(result, '/users')
			return await this.repository.paginate(query, options)
		} catch (error) {
			throw new Error('Error al obtener usuarios paginados')
		}
	}
}
