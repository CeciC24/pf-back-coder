import ProductsModel from "../models/productsModel.js";

class ProductManager {
    constructor() {}

    async addProduct(newProduct) {
        let response = await ProductsModel.create(newProduct)
        return response
    }

    async getProducts() {
        let response = await ProductsModel.find()
        return response
    }

    async getProductById(id) {
        let response = await ProductsModel.findById(id)
        return response
    }

    async updateProduct(id, field) {
        let response = await ProductsModel.findByIdAndUpdate(id, field)
        return response
    }

    async deleteProduct(id) {
        let response = await ProductsModel.findByIdAndDelete(id)
        return response
    }
}

export default ProductManager