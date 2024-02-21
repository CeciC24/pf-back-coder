import fs from 'fs'
import { nanoid } from 'nanoid'

class ProductManager {
	constructor(path) {
		this.path = path
		this.products = []
	}

	addProduct = async (productToAdd) => {
		if (fs.existsSync(this.path)) {
			this.products = await this.getProducts()
			const search = this.products.find((product) => product.code === productToAdd.code)

			if (search) {
				throw new Error("⚠️  No se pudo agregar el producto. El campo 'code' ya existe.")
			} else if (!this.isValidProduct(productToAdd)) {
				throw new Error('⚠️  No se pudo agregar el producto. Faltan campos.')
			}
		}

		await this.saveProduct({ id: nanoid(), status: true, ...productToAdd })
	}

	isValidProduct = (product) => {
		if (
			(!product.title ||
				!product.description ||
				!product.code ||
				!product.price ||
				!product.stock ||
				!product.category) &&
			!Object.values(product).every((field) => field !== null && field !== undefined)
		) {
			return false
		}

		return true
	}

	saveProduct = async (productToSave) => {
		this.products.push(productToSave)
		await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
	}

	getProducts = async () => {
		if (fs.existsSync(this.path)) {
			let response = await fs.promises.readFile(this.path, 'utf-8')
			return JSON.parse(response)
		} else {
			return []
		}
	}

	getProductById = async (id) => {
		let search = this.exists(id)

		if (search) {
			return search
		} else {
			throw new Error(`⚠️  ID: ${id} Not found`)
		}
	}

	updateProduct = async (id, field) => {
		let oldProduct = await this.getProductById(id)

		await this.deleteProduct(id)

		let newProduct = { ...oldProduct, ...field }

		await this.saveProduct(newProduct)
	}

	deleteProduct = async (id) => {
		this.products = await this.getProducts()
		let filter = this.products.filter((product) => product.id !== id)

		if (filter.length === this.products.length) {
			throw new Error(`⚠️  ID: ${id} Not found`)
		}

		await fs.promises.writeFile(this.path, JSON.stringify(filter, null, '\t'))

		this.products = await this.getProducts()
	}

	exists = async (id) => {
		let response = await this.getProducts()
		let search = response.find((product) => product.id === id)

		return search
	}
}

export default ProductManager
