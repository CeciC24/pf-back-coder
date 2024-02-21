import { Router } from 'express';
import ProductManager from '../controllers/ProductManager.js'

const ProductMngr = new ProductManager('src/models/products.json')
const ProductRouter = Router()

const getProducts = ProductMngr.getProducts()

ProductRouter.get("/", async (req, res) => {
    let limit = parseInt(req.query.limit)
    if(!limit) { return res.send(await getProducts) }

    let allProducts = await getProducts
    let productLimit = allProducts.slice(0, limit)
    res.send(productLimit)
})

ProductRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid

    try {
        let product = await ProductMngr.getProductById(pid)
        res.send(product)
    } catch (error) {
        res.status(404).send({ error: 'Producto no encontrado' })
    }
})

ProductRouter.post("/", async (req, res) => {
    let newProduct = req.body
    res.send(await ProductMngr.addProduct(newProduct))
})

ProductRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid
    let newField = req.body
    res.send(await ProductMngr.updateProduct(pid, newField))
})

ProductRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid
    res.send(await ProductMngr.deleteProduct(pid))
})


export default ProductRouter