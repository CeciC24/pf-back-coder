import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import connectDb from './config/db.config.js'

// Router imports para File System
import ProductRouter from './router/fileSystem/products.routes.js'
import CartRouter from './router/fileSystem/carts.routes.js'

// Router imports para MongoDB
import ViewsRouter from './router/views.routes.js'
import ProductsRouter from './router/products.routes.js'
import CartsRouter from './router/carts.routes.js'
import MessagesRouter from './router/messages.routes.js'

import FSProductManager from './dao/services/FSProductManager.js'

const app = express()

const FSProductMngr = new FSProductManager('src/data/products.json')

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas para views
app.use('/', ViewsRouter)

// Rutas para File System
app.use('/api/fs/products', ProductRouter)
app.use('/api/fs/cart', CartRouter)

// Rutas para MongoDB
app.use('/api/products', ProductsRouter)
app.use('/api/cart', CartsRouter)
app.use('/api/messages', MessagesRouter)


const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
	console.log(`Server running in port ${server.address().port}`)
})

connectDb()


const io = new Server(server)
server.on('error', (error) => console.error(`Server error: ${error}`))

io.on('connection', (socket) => {
	console.log('Nuevo cliente conectado')

	socket.on('addProduct', async (product) => {
		try {
			const productAdded = await FSProductMngr.addProduct(product)
			io.emit('addToTheList', productAdded)
		} catch (error) {
			console.error(error.message)
		}
	})

	socket.on('deleteProduct', async (productID) => {
		try {
			await FSProductMngr.deleteProduct(productID)
			io.emit('deleteFromList', productID)
		} catch (error) {
			console.error(error.message)
		}
	})

	socket.on('addToCart', async (product) => {
		// Aún no implementado

		/* const cart = await CartMngr.addProductToCart(cartID, product._id) */
		/* io.emit('productAddedToCart', cart) */
	})
})
