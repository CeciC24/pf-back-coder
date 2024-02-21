import express from 'express'
import ProductRouter from './router/product.routes.js'
import CartRouter from './router/carts.routes.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Server running in port ${server.address().port}`)
})
server.on("error", error => console.error(`Server error: ${error}`))