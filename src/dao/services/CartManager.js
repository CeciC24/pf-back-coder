import CartsModel from '../models/cartsModel.js'
import ProductManager from './ProductManager.js'

const ProductMngr = new ProductManager()

class CartManager {
	constructor() {
		console.log('CartManager constructor')
	}

	async addCart(newCart = { products: [] }) {
		let response = await CartsModel.create(newCart)
		return response
	}

	async getCarts() {
		let response = await CartsModel.find()
		return response
	}

	async getCartById(id) {
		let response = await CartsModel.findById(id)
		return response
	}

	async addProductToCart(cid, pid) {
		let cart = await this.getCartById(cid)
		let product = await ProductMngr.getProductById(pid)

		if (cart) {
			if (product) {
				let productInCart = cart.products.find((p) => p.product.toString() == pid.toString())

				if (productInCart) {
					productInCart.quantity += 1
                    cart.markModified('products')
				} else {
					cart.products.push({ product: pid, quantity: 1 })
				}

				await cart.save()
			} else {
				throw new Error(`⚠️  Product ID: ${pid} Not found`)
			}
		} else {
			throw new Error(`⚠️  Cart ID: ${cid} Not found`)
		}

		let updatedCart = await this.getCartById(cid)
		return updatedCart
	}

	async deleteProductFromCart(cid, pid) {
		let cart = await this.getCartById(cid)

		if (cart) {
			let productInCart = cart.products.find((p) => p.product.toString() == pid.toString())

			if (productInCart) {
				if (productInCart.quantity > 1) {
					productInCart.quantity -= 1
					cart.markModified('products')
				} else {
					cart.products.pull(productInCart)
				}
				await cart.save()
			} else {
				throw new Error(`⚠️  Product ID: ${pid} Not found`)
			}
		} else {
			throw new Error(`⚠️  Cart ID: ${cid} Not found`)
		}

		let updatedCart = await this.getCartById(cid)
		return updatedCart
	}

	async emptyCart(id) {
		let response = await CartsModel.findByIdAndUpdate(id, { products: [] })
		return response
	}
}

export default CartManager
