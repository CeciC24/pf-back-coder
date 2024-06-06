import ProductsRepository from '../../repositories/products.repository.js'
import paginateFormat from '../../paginateFormat.js'

export default class ProductManager {
	constructor() {
        this.repository = new ProductsRepository()
    }

	isValid(product) {
		if (
			!product.title ||
			!product.description ||
			!product.code ||
			!product.price ||
			!product.stock ||
			!product.category
		) {
			return false
		}
		return true
	}

	async create(newProduct) {
        const search = await this.repository.findOne(newProduct.code)

        if (search) {
            throw new Error("No se pudo agregar el producto. El campo 'code' ya existe.")
        } else if (!this.isValid(newProduct)) {
            throw new Error('No se pudo agregar el producto. Faltan campos.')
        }

        return await this.repository.create(newProduct)
    }

	async get() {
        return await this.repository.find()
    }

    async getById(id) {
        return await this.repository.findById(id)
    }

    async update(id, productData) {
        await this.repository.updateOne(id, productData)
        return await this.repository.findById(id)
    }

	async delete(id) {
		let response = await this.repository.findByIdAndDelete(id)
		return response
	}

	async getAllWithCategories() {
		try {
			return await this.repository.findWithCategories()
		} catch (error) {
			console.log('Error al obtener todos los productos')
		}
	}

	async getPaginated(page, limit, sort, query, populate = null) {
		try {
			const options = {
				page: page || 1,
				limit: limit || 10,
				sort: sort ? { price: sort } : null,
				populate: populate ? populate : null,
			}
			const result = await this.repository.paginate(query, options)
			
			const products = paginateFormat(result, '/products')
			return products
		} catch (error) {
			throw new Error('Error al obtener productos paginados')
		}
	}

	async purchase(id, quantity) {
		const product = await this.repository.findById(id)
		if (!product) {
			throw new Error('Producto no encontrado')
		}
		if (product.stock < quantity) {
			throw new Error('No hay stock suficiente')
		}
		product.stock -= quantity
		await product.save()
		return product
	}
}