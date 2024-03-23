import { Router } from 'express';
import ProductManager from '../dao/services/FSProductManager.js'

const router = Router()
const ProductMngr = new ProductManager('src/data/products.json')

const getProducts = ProductMngr.getProducts()

router.get('/', async (req, res) => {
	let limit = parseInt(req.query.limit)
    
	try {
		const allProducts = await getProducts
		let productLimit = allProducts

		if(limit) {
			productLimit = allProducts.slice(0, limit)
		}

		res.render('home', {
			title: 'Home | Desafío 4',
			style: 'home.css',
			products: productLimit
		})
		
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})

router.get('/realtimeproducts', async (req, res) => {
	try {
		let allProducts = await getProducts

		res.render('realTimeProducts', {
			title: 'Real time Products | Desafío 4',
			style: 'realTimeProducts.css',
			products: allProducts
		})
		
	} catch (error) {
		return res.status(500).send({ error: 'Error al obtener productos' })
	}
})


export default router
