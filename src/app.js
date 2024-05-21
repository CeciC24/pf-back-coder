import createExpressApp from './config/createApp.js'
import connectDb from './config/db.config.js'
import middlewaresConfig from './config/middlewares.config.js'
import registerRoutes from './config/registerRoutes.js'

function main(){
	try {
		const app = createExpressApp()
		
		// Conexión a la base de datos
		connectDb()
		
		// Configuración de middlewares
		middlewaresConfig(app)
		
		// Registro de rutas
		registerRoutes(app)

	} catch (error) {
		console.log('Error al inicializar la app: ' + error.message)
	}
}

main()
