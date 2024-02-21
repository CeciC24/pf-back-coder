import { Router } from 'express';
import CartManager from '../controllers/CartManager.js'

const CartMngr = new CartManager('src/models/cart.json')
const CartRouter = Router()

CartRouter.post("/", async (req, res) => {
    res.send(await CartMngr.addCart())

})

CartRouter.get("/", async (req, res) => {
    res.send(await CartMngr.getCarts())
})

CartRouter.get("/:cid", async (req, res) => {
    let cid = req.params.cid

    res.send(await CartMngr.getCartById(cid))
})

CartRouter.post("/:cid/product/:pid", async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid

    res.send(await CartMngr.addProductToCart(cid, pid))
})

export default CartRouter