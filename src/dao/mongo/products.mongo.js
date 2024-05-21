import ProductsModel from './models/products.model.js'
import paginateFormat from '../../paginateFormat.js'

class ProductManager {
	constructor() {}

	async addProduct(newProduct) {
		const search = await ProductsModel.findOne({ code: newProduct.code })

		if (search) {
			throw new Error("No se pudo agregar el producto. El campo 'code' ya existe.")
		} else if (!this.isValidProduct(newProduct)) {
			throw new Error('No se pudo agregar el producto. Faltan campos.')
		}

		let response = await ProductsModel.create(newProduct)
		return response
	}

	isValidProduct(product) {
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

	async getProducts() {
		let response = await ProductsModel.find()
		return response
	}

	async getProductById(id) {
		let response = await ProductsModel.findById(id)
		return response
	}

	async updateProduct(id, field) {
		await ProductsModel.findByIdAndUpdate(id, field)
		let updatedProduct = await ProductsModel.findById(id)
		return updatedProduct
	}

	async deleteProduct(id) {
		let response = await ProductsModel.findByIdAndDelete(id)
		return response
	}

	async getAllProductsWithCategories() {
		try {
			const products = await ProductsModel.find().populate('category')
			return products
		} catch (error) {
			console.log('Error al obtener todos los productos')
		}
	}

	async getPaginatedProducts(page, limit, sort, query, populate = null) {
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
}

export default ProductManager
