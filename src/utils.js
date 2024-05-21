import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import config from './config/environment.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuración de multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + 'public/img')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	},
})

// Generar un token JWT
export const generateToken = (user) => {
	return jwt.sign({ user }, config.jwtSecret, { expiresIn: '1h' })
}

// Verificar un token JWT
export const passportCall = (strategy) => {
	return async (req, res, next) => {
		passport.authenticate(strategy, { session: false }, (error, user, info) => {
			if (!user && req.url === '/current') {
				return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
			}
			if (error) { return next(error) }
			req.user = user
			next()
		})(req, res, next)
	}
}

// Hashear una contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Validar una contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export default __dirname