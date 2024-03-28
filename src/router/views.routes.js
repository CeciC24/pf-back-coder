import { Router } from 'express';
import FSProductManager from '../dao/services/FSProductManager.js'

import ProductsModel from '../dao/models/productsModel.js';
import paginateFormat from '../paginateFormat.js';
import CartsModel from '../dao/models/cartsModel.js';

const router = Router()

const FSProductMngr = new FSProductManager('src/data/products.json')
const getFSProducts = FSProductMngr.getProducts()


// File System routes
router.get('/', async (req, res) => {
	let limit = parseInt(req.query.limit)
    
	try {
		const allProducts = await getFSProducts
		let productLimit = allProducts

		if(limit) {
			productLimit = allProducts.slice(0, limit)
		}

		res.render('home', {
			title: 'Home',
			style: 'home.css',
			products: productLimit
		})
		
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})

router.get('/realtimeproducts', async (req, res) => {
	try {
		let allProducts = await getFSProducts

		res.render('realTimeProducts', {
			title: 'Real time Products',
			style: 'realTimeProducts.css',
			products: allProducts
		})
		
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})


// MongoDB routes
router.get('/products', async (req, res) => {
	const options = {
		page: parseInt(req.query.page) || 1,
		limit: parseInt(req.query.limit) || 10,
		sort: req.query.sort ? { price: req.query.sort } : null
	}
	const query = req.query.query ? JSON.parse(req.query.query) : {}
	
	try {
		let result = await ProductsModel.paginate(query, options)

		let paginatedProducts = paginateFormat(result, '/products')

		res.render('allProducts', {
			title: 'Products',
			style: 'allProducts.css',
			products: JSON.parse(JSON.stringify(paginatedProducts.payload)),
			totalPages: paginatedProducts.totalPages,
			page: paginatedProducts.page
		})

	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})

router.get('/products/:id', async (req, res) => {
	const id = req.params.id

	try {
		const product = await ProductsModel.findById(id).lean()
		console.log(product)

		if(!product) {
			return res.status(404).send({ error: 'Producto no encontrado' })
		}

		res.render('singleProduct', {
			title: product.title,
			style: '../../css/singleProduct.css',
			product: product
		})
		
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener producto' })
	}
})

router.get('/carts/:cid', async (req, res) => {
	const id = req.params.cid

	try {
		const cart = await CartsModel.findById(id).lean()

		if(!cart) {
			return res.status(404).send({ error: 'Carrito no encontrado' })
		}

		const products = cart.products

		const total = products.reduce((acc, p) => acc + p.product.price * p.quantity, 0)

		res.render('cart', {
			title: 'Carrito',
			style: '../../css/cart.css',
			products: products,
			total
		})
		
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener carrito' })
	}
})


export default router
