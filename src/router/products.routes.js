import { Router } from 'express'
import ProductManager from '../dao/services/ProductManager.js'
import ProductsModel from '../dao/models/productsModel.js'

const ProductMngr = new ProductManager()
const ProductRouter = Router()

/* const getProducts = ProductMngr.getProducts() */

ProductRouter.get('/', async (req, res) => {
	let limit = parseInt(req.query.limit)
	let page = parseInt(req.query.page)
	let sort = req.query.sort
	let query = req.query.query ? JSON.parse(req.query.query) : {}

	try {
		let result = await ProductsModel.paginate(query, {
			page: page || 1,
			limit: limit || 10,
			sort: sort ? { price: sort } : null,
		})

		let response = {
			status: 'success',
			payload: result.docs,
			totalPages: result.totalPages,
			prevPage: result.prevPage,
			nextPage: result.nextPage,
			page: result.page,
			hasPrevPage: result.hasPrevPage,
			hasNextPage: result.hasNextPage,
			prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
			nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
		}

		return res.send(response)
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})

ProductRouter.get('/:pid', async (req, res) => {
	let pid = req.params.pid

	try {
		let product = await ProductMngr.getProductById(pid)
		res.send(product)
	} catch (error) {
		res.status(404).send({ error: 'Producto no encontrado' })
	}
})

ProductRouter.post('/', async (req, res) => {
	let newProduct = req.body

	try {
		res.send(await ProductMngr.addProduct(newProduct))
	} catch (error) {
		res.status(500).send({ error: 'Error al agregar producto' })
	}
})

ProductRouter.put('/:pid', async (req, res) => {
	let pid = req.params.pid
	let newField = req.body

	try {
		res.send(await ProductMngr.updateProduct(pid, newField))
	} catch (error) {
		res.status(500).send({ error: 'Error al actualizar producto' })
	}
})

ProductRouter.delete('/:pid', async (req, res) => {
	let pid = req.params.pid

	try {
		res.send(await ProductMngr.deleteProduct(pid))
	} catch (error) {
		res.status(500).send({ error: 'Error al eliminar producto' })
	}
})

export default ProductRouter
