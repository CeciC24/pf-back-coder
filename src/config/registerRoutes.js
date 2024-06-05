// Router imports para Views
import ViewsRouter from '../router/views.routes.js'

// Router imports para File System
import FSProductRouter from '../router/fileSystem/products.routes.js'
import FSCartRouter from '../router/fileSystem/carts.routes.js'

// Router imports para MongoDB
import ProductsRouter from '../router/products.routes.js'
import CartsRouter from '../router/carts.routes.js'
import MessagesRouter from '../router/messages.routes.js'
import SessionsRouter from '../router/sessions.routes.js'
import CategoriesRouter from '../router/category.routes.js'
import UsersRouter from '../router/users.routes.js'

import nodemailer from 'nodemailer'

const registerRoutes = (app) => {
	try {
		// Rutas para views
		app.use('/', ViewsRouter)
	
		// Rutas para File System
		app.use('/api/fs/products', FSProductRouter)
		app.use('/api/fs/cart', FSCartRouter)
	
		// Rutas para MongoDB
		app.use('/api/products', ProductsRouter)
		app.use('/api/categories', CategoriesRouter)
		app.use('/api/cart', CartsRouter)
		app.use('/api/users', UsersRouter)
		app.use('/api/messages', MessagesRouter)
		app.use('/api/sessions', SessionsRouter)

		// Configuración de nodemailer
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			port: 587,
			auth: {
				user: 'ceciliacc3@gmail.com',
				pass: 'dhyn vtpt zqkt mgwf',
			}
		})

		app.get('/mail', (req, res) => {
			let result = transporter.sendMail({
				from: 'Coder Tests <ceciliacc3@gmail.com>',
				to: 'ceciliacc3@gmail.com',
				subject: 'Correo de prueba',
				html: `
				<div>
					<h1>Test</h1>
				</div>
				`,
				attachments: []
			})
		})

	} catch (error) {
		throw new Error('No se pudieron registrar las rutas: ' + error.message)
	}
}

export default registerRoutes