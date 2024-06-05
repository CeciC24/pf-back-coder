import { Router } from 'express'
import passport from 'passport'

import config from '../config/environment.config.js'
import AuthManager from '../dao/services/auth.service.js'
import { authorization } from '../middlewares/auth.middleware.js'
import { passportCall } from '../utils.js'
import { CurrentUserDTO } from '../dao/DTOs/user.dto.js'

const SessionsRouter = Router()
const authManager = new AuthManager()

// * Current - JWT
SessionsRouter.get('/current', passportCall('current'), async (req, res) => {
	const currentUser = new CurrentUserDTO(req.user.user)
	res.status(200).send({ status: 'success', message: 'Usuario autenticado', payload: currentUser })
})

// * Login - JWT
SessionsRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		if (!email || !password) {
			return res.status(400).send({ status: 'error', error: 'Faltan datos' })
		}

		const userToken = await authManager.login({ email, password })

		if (userToken.token) {
			res.cookie(config.tokenCookieName, userToken.token, {
				httpOnly: true,
			})
				.status(200)
				.send({ status: 'success', message: userToken.message })
		}
	} catch (error) {
		res.send({ status: 'error', message: error.message })
	}
})

// * Logout - JWT
SessionsRouter.post('/logout', (req, res) => {
	try {
		res.clearCookie(config.tokenCookieName).send({ status: 'success', message: 'Sesión cerrada' })
	} catch (error) {
		return res.status(400).send({ status: 'error', message: error.message })
	}
})

// * Register - JWT
SessionsRouter.post('/register', async (req, res) => {
	try {
		const { first_name, last_name, email, age, password } = req.body

		const userToken = await authManager.register({ first_name, last_name, email, age, password })

		if (userToken.token) {
			res.cookie(config.tokenCookieName, userToken.token, {
				httpOnly: true,
			})
				.status(201)
				.send({ status: 'success', message: userToken.message })
		}
	} catch (error) {
		res.send({ status: 'error', message: error.message })
	}
})

// * Restore - JWT
SessionsRouter.post('/restore', async (req, res) => {
	try {
		const { email, password } = req.body

		const userToken = await authManager.restore({ email, password })

		if (userToken.token) {
			res.cookie(config.tokenCookieName, userToken.token, {
				httpOnly: true,
			})
				.status(200)
				.send({ status: 'success', message: userToken.message })
		}
	} catch (error) {
		res.status(500).send({ status: 'error', error: error.message })
	}
})

// * Login con GitHub
SessionsRouter.get(
	'/github',
	passport.authenticate('github', { session: false, scope: ['user:email'] }),
	async (req, res) => {}
)

SessionsRouter.get(
	'/githubcallback',
	passport.authenticate('github', { session: false, failureRedirect: '/login' }),
	async (req, res) => {
		res.cookie(config.tokenCookieName, req.user.token, {
			httpOnly: true,
		}).redirect('/')
	}
)

export default SessionsRouter
