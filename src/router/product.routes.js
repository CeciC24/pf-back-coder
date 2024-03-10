import { Router } from 'express';
import ProductManager from '../controllers/ProductManager.js'

const ProductMngr = new ProductManager('src/models/products.json')
const ProductRouter = Router()

const getProducts = ProductMngr.getProducts()

ProductRouter.get("/", async (req, res) => {
    let limit = parseInt(req.query.limit)
    if(!limit) { 
        try {
            return res.send(await getProducts) 
        } catch (error) {
            return res.status(500).send({ error: 'Error al obtener productos' })
        }
    }

    try {
        let allProducts = await getProducts
        let productLimit = allProducts.slice(0, limit)
        res.send(productLimit)
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener productos' })
    }
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

    try {
        res.send(await ProductMngr.addProduct(newProduct))
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar producto' })
    }
})

ProductRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid
    let newField = req.body

    try {
        res.send(await ProductMngr.updateProduct(pid, newField))
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar producto' })
    }
})

ProductRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid

    try {
        res.send(await ProductMngr.deleteProduct(pid))
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar producto' })
    }
})


export default ProductRouter