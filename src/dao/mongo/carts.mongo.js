import CartsModel from './models/carts.model.js'
import ProductManager from './products.mongo.js'

const ProductMngr = new ProductManager()

class CartManager {
	constructor() {}

	async create(newCart = { products: [] }) {
		let response = await CartsModel.create(newCart)
		return response
	}

	async get() {
		let response = await CartsModel.find()
		return response
	}

	async getById(id) {
		let response = await CartsModel.findById(id)
		return response
	}

	async addProductToCart(cid, pid) {
		let cart = await this.getById(cid)
		let product = await ProductMngr.getById(pid)

		if (cart) {
			if (product) {
				let productInCart = cart.products.find((p) => p.product._id == pid)

				if (productInCart) {
					productInCart.quantity += 1
				} else {
					cart.products.push({ product: pid, quantity: 1 })
				}

			} else {
				throw new Error(`⚠️  Product ID: ${pid} Not found`)
			}
		} else {
			throw new Error(`⚠️  Cart ID: ${cid} Not found`)
		}
s
		return await cart.save()
	}

	async deleteProductFromCart(cid, pid) {
		let cart = await this.getById(cid)

		if (cart) {
			let productInCart = cart.products.find((p) => p.product._id == pid)

			if (productInCart) {
				if (productInCart.quantity > 1) {
					productInCart.quantity -= 1
				} else {
					cart.products.pull(productInCart)
				}
				
			} else {
				throw new Error(`⚠️  Product ID: ${pid} Not found`)
			}
		} else {
			throw new Error(`⚠️  Cart ID: ${cid} Not found`)
		}

		return await cart.save()
	}

	async update(cid, newCartProducts) {
		const cart = await this.getById(cid)
		await this.empty(cart._id)

		cart.products = newCartProducts

		return await cart.save()
	}

	async updateProductInCart(cid, pid, newQuantity) {
		let cart = await this.getById(cid)
		let product = await ProductMngr.getById(pid)

		if (cart) {
			if (product) {
				let productInCart = cart.products.find((p) => p.product._id == pid)

				if (productInCart) {
					productInCart.quantity = newQuantity.quantity
				} else {
					throw new Error(`⚠️  Product ID: ${pid} Not found in Cart ID: ${cid}`)
				}

			} else {
				throw new Error(`⚠️  Product ID: ${pid} Not found`)
			}
		} else {
			throw new Error(`⚠️  Cart ID: ${cid} Not found`)
		}

		return await cart.save()
	}

	async empty(id) {
		let emptyCart = await CartsModel.findByIdAndUpdate(id, { products: [] })
		return await emptyCart.save()
	}
}

export default CartManager
