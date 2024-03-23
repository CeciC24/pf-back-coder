import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'

// Router imports para file system
import ProductRouter from './router/fileSystem/products.routes.js'
import CartRouter from './router/fileSystem/carts.routes.js'

// Router imports para mongoDB
import ViewsRouter from './router/views.routes.js'
import ProductsRouter from './router/products.routes.js'
import CartsRouter from './router/carts.routes.js'
import MessagesRouter from './router/messages.routes.js'

import ProductManager from './dao/services/FSProductManager.js'

const app = express()

const ProductMngr = new ProductManager('src/data/products.json')

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas para views
app.use('/', ViewsRouter)

// Rutas para file system
app.use('/api/fs/products', ProductRouter)
app.use('/api/fs/cart', CartRouter)

// Rutas para mongoDB
app.use('/api/products', ProductsRouter)
app.use('/api/cart', CartsRouter)
app.use('/api/messages', MessagesRouter)


const environment = async () => {
	const DB_URL = 'mongodb+srv://cecic24:4193531@codercluster.8naffdo.mongodb.net/ecommerce'

	try {
		await mongoose.connect(DB_URL)
		console.log('Database connected')
	} catch (error) {
		console.error('Error connecting to the database:', error.message)
		process.exit()
	}
}

environment()

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
	console.log(`Server running in port ${server.address().port}`)
})

const io = new Server(server)

server.on('error', (error) => console.error(`Server error: ${error}`))

io.on('connection', (socket) => {
	console.log('Nuevo cliente conectado')

	socket.on('addProduct', async (product) => {
		try {
			const productAdded = await ProductMngr.addProduct(product)
			io.emit('addToTheList', productAdded)
		} catch (error) {
			console.error(error.message)
		}
	})

	socket.on('deleteProduct', async (productID) => {
		try {
			await ProductMngr.deleteProduct(productID)
			io.emit('deleteFromList', productID)
		} catch (error) {
			console.error(error.message)
		}
	})
})
