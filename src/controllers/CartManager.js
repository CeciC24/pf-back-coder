import fs from 'fs'
import { nanoid } from 'nanoid'
import ProductManager from './ProductManager.js'

const AllProducts = new ProductManager('src/models/products.json')

class CartManager {
	constructor(path) {
		this.path = path
		this.carts = []
	}

	async addCart() {
        this.carts = await this.getCarts()

		await this.saveCart({id: nanoid(), products: []}, ...this.carts)
	}
    
	async saveCart(cartToSave) {
        this.carts.push(cartToSave)
		await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
	}
    
    async getCarts() {
        if (fs.existsSync(this.path)) {
            let response = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(response)
        } else {
            return []
        }
    }
    
	async getCartById(id) {
		let response = await this.getCarts()
		let search = response.find(cart => cart.id === id)

		if (search) {
			return search.products
		} else {
			throw new Error(`⚠️  Cart ID: ${id} Not found`)
		}
	}

    async addProductToCart(cid, pid) {
        let cart = await this.exists(cid)
        let product = await AllProducts.exists(pid)

        if (cart && product) {
            let prodIndex = cart.products.findIndex(prod => prod.id === pid)

            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity++
    
            } else {
                cart.products.push({id: pid, quantity: 1})
            }

            await this.updateCart(cart)
        }
    }

	async updateCart(cart) {
		await this.deleteCart(cart.id)
		await this.saveCart(cart)
	}

	async deleteCart(id) {
        this.carts = await this.getCarts()
		let filter = this.carts.filter(cart => cart.id !== id)

		if (filter.length === this.carts.length) {
			throw new Error(`⚠️  Cart ID: ${id} Not found`)
		}

		await fs.promises.writeFile(this.path, JSON.stringify(filter, null, '\t'))

		this.carts = await this.getCarts()
	}

    async exists(id) {
		let response = await this.getCarts()
		let search = response.find(cart => cart.id === id)

		return search
	}
}

export default CartManager
