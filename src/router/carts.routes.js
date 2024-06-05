import { Router } from 'express'
import CartManager from '../dao/mongo/carts.mongo.js'

import { authorization } from '../middlewares/auth.middleware.js'
import { passportCall } from '../utils.js'

const CartMngr = new CartManager()
const CartsRouter = Router()

CartsRouter.get('/', async (req, res) => {
	try {
		res.status(200).send(await CartMngr.get())
	} catch (error) {
		res.status(500).send({ error: 'Error al obtener carritos' })
	}
})

CartsRouter.get('/:cid', async (req, res) => {
	let cid = req.params.cid

	try {
		res.status(200).send(await CartMngr.getById(cid))
	} catch (error) {
		res.status(404).send({ error: 'Carrito no encontrado' })
	}
})

CartsRouter.post('/', async (req, res) => {
	try {
		let newCart = await CartMngr.create()
		res.status(200).send(newCart)
	} catch (error) {
		res.status(500).send({ error: 'Error al crear carrito' })
	}
})

CartsRouter.post('/:cid/product/:pid', passportCall('current'), authorization('user'), async (req, res) => {
	let cid = req.params.cid
	let pid = req.params.pid

	try {
		res.status(200).send(await CartMngr.addProductToCart(cid, pid))
	} catch (error) {
		res.status(500).send({ error: 'Error al agregar producto al carrito | ' + error.message })
	}
})

CartsRouter.delete('/:cid/product/:pid', async (req, res) => {
	let cid = req.params.cid
	let pid = req.params.pid

	try {
		res.status(200).send(await CartMngr.deleteProductFromCart(cid, pid))
	} catch (error) {
		res.status(500).send({ error: 'Error al eliminar producto del carrito | ' + error.message })
	}
})

CartsRouter.delete('/:cid', async (req, res) => {
	let cid = req.params.cid

	try {
		res.status(200).send(await CartMngr.empty(cid))
	} catch (error) {
		res.status(500).send({ error: 'Error al vaciar carrito' })
	}
})

CartsRouter.put('/:cid', async (req, res) => {
	let cid = req.params.cid
	let newCartProducts = req.body

	try {
		res.status(200).send(await CartMngr.update(cid, newCartProducts))
	} catch (error) {
		res.status(500).send({ error: 'Error al actualizar carrito' })
	}
})

CartsRouter.put('/:cid/product/:pid', async (req, res) => {
	let cid = req.params.cid
	let pid = req.params.pid
	let newQuantity = req.body

	try {
		res.status(200).send(await CartMngr.updateProductInCart(cid, pid, newQuantity))
	} catch (error) {
		res.status(500).send({ error: 'Error al actualizar la cantidad del producto en carrito' })
	}
})

CartsRouter.get('/:cid/purchase', async (req, res) => {
	let cid = req.params.cid

	try {
		res.status(200).send(await CartMngr.purchaseCart(cid, req.user.user))
	} catch (error) {
		res.status(500).send({ error: 'Error al realizar la compra: ' + error.message })
	}
})

export default CartsRouter
