import dotenv from 'dotenv'

dotenv.config()

export default {
    mongoURL: process.env.MONGO_URL,
    port: process.env.PORT,
    gitClientID: process.env.GIT_CLIENT_ID,
    gitClientSecret: process.env.GIT_CLIENT_SECRET,
    gitCallbackURL: process.env.GIT_CALLBACK_URL,
    jwtSecret: process.env.JWT_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    tokenCookieName: process.env.TOKEN_COOKIE_NAME,
}