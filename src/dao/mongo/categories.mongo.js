import CategoriesRepository from "../../repositories/categories.repository.js"

export default class CategoryManager {
    constructor() {
        this.repository = new CategoriesRepository()
    }

    async get() {
        return await this.repository.find()
    }

    async getById(id) {
        return await this.repository.findById(id)
    }

    async create(newCategory) {
        const search = await this.repository.findOne(newCategory.name)

        if (search) {
            throw new Error("No se pudo agregar la categoría porque ya existe.")
        }

        return await this.repository.create(newCategory)
    }

    async update(id, categoryData) {
        await this.repository.updateOne(id, categoryData)
        return await this.repository.findById(id)
    }

    async delete(id) {
        const response = await this.repository.findByIdAndDelete(id)
        if (!response) {
            throw new Error('No se pudo eliminar la categoría')
        }
        return response
    }
}
