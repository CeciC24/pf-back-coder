import CartsRepository from '../../repositories/carts.repository.js'
import ProductManager from './products.mongo.js'
import TicketsManager from './tickets.mongo.js'

const ProductMngr = new ProductManager()
const TicketMngr = new TicketsManager()

export default class CartManager {
	constructor() {
        this.repository = new CartsRepository()
    }

	async create(newCart = { products: [] }) {
		return await this.repository.create(newCart)
	}

	async get() {
		return await this.repository.find()
	}

	async getById(id) {
		return await this.repository.findById(id)
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
		let emptyCart = await this.repository.updateById(id, { products: [] })
		return await emptyCart.save()
	}

	async purchaseCart(id, user) {
		let cart = await this.getById(id)
		let products = cart.products

		let amountPurchased = 0
		let productsNotPurchased = []

		products.forEach(async (product) => {
			try {
				await ProductMngr.purchase(product.product.id, product.quantity)
				amountPurchased += product.product.price * product.quantity
			} catch (error) {
				productsNotPurchased.push({ product: product.product.id, quantity: product.quantity })
			}
		})

		TicketMngr.create({ amount: amountPurchased, purchaser: user.email })

		await this.update(id, productsNotPurchased)

		if (productsNotPurchased.length > 0) {
			return `No se pudo realizar la compra de los siguientes productos: ` + productsNotPurchased.map((p) => p.product)
		}

		return await this.getById(id)
	}
}