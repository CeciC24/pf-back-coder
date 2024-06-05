import { Router } from 'express'
import ProductManager from '../dao/mongo/products.mongo.js'
import ProductDTO from '../dao/DTOs/product.dto.js'

import { authorization } from '../middlewares/auth.middleware.js'
import { passportCall } from '../utils.js'

const ProductMngr = new ProductManager()
const ProductRouter = Router()

ProductRouter.get('/', async (req, res) => {
	let limit = parseInt(req.query.limit)
	let page = parseInt(req.query.page)
	let sort = req.query.sort
	let query = req.query.query ? JSON.parse(req.query.query) : {}
	let populate = 'category'

	try {
		const response = await ProductMngr.getPaginated(page, limit, sort, query, populate)

		return res.status(200).json({ response })
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})

ProductRouter.get('/:pid', async (req, res) => {
	let pid = req.params.pid

	try {
		let product = await ProductMngr.getById(pid)
		res.status(200).send(product)
	} catch (error) {
		res.status(404).send({ error: 'Producto no encontrado' })
	}
})

ProductRouter.post('/', passportCall('current'), authorization('admin'), async (req, res) => {
	let productData = req.body

	try {
		const newProduct = new ProductDTO(productData)
		res.status(200).send(await ProductMngr.create(newProduct))
	} catch (error) {
		res.status(500).send({ error: error.message || 'Error al agregar producto' })
	}
})

ProductRouter.put('/:pid', passportCall('current'), authorization('admin'), async (req, res) => {
	let pid = req.params.pid
	let newField = req.body

	try {
		res.status(200).send(await ProductMngr.update(pid, newField))
	} catch (error) {
		res.status(500).send({ error: 'Error al actualizar producto' })
	}
})

ProductRouter.delete('/:pid', passportCall('current'), authorization('admin'), async (req, res) => {
	let pid = req.params.pid

	try {
		res.status(200).send(await ProductMngr.delete(pid))
	} catch (error) {
		res.status(500).send({ error: 'Error al eliminar producto' })
	}
})

export default ProductRouter