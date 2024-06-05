import ProductsModel from './models/products.model.js'
import paginateFormat from '../../paginateFormat.js'

class ProductManager {
	constructor() {}

	async create(newProduct) {
		const search = await ProductsModel.findOne({ code: newProduct.code })

		if (search) {
			throw new Error("No se pudo agregar el producto. El campo 'code' ya existe.")
		} else if (!this.isValid(newProduct)) {
			throw new Error('No se pudo agregar el producto. Faltan campos.')
		}

		let response = await ProductsModel.create(newProduct)
		return response
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

	async get() {
		let response = await ProductsModel.find()
		return response
	}

	async getById(id) {
		let response = await ProductsModel.findById(id)
		return response
	}

	async update(id, field) {
		await ProductsModel.findByIdAndUpdate(id, field)
		let updatedProduct = await ProductsModel.findById(id)
		return updatedProduct
	}

	async delete(id) {
		let response = await ProductsModel.findByIdAndDelete(id)
		return response
	}

	async getAllWithCategories() {
		try {
			const products = await ProductsModel.find().populate('category')
			return products
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
			const result = await ProductsModel.paginate(query, options)
			
			const products = paginateFormat(result, '/products')
			return products
		} catch (error) {
			throw new Error('Error al obtener productos paginados')
		}
	}

	async purchase(id, quantity) {
		const product = await ProductsModel.findById(id)
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

export default ProductManager
