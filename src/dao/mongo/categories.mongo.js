import CategoriesModel from "./models/categories.model.js"

export default class CategoryManager {
	constructor() {}

	async getAll() {
		const response = await CategoriesModel.find()
		return response
	}

	async getById(id) {
		const response = await CategoriesModel.findById(id)
		return response
	}

	async createCategory(newCategory) {
		const search = await CategoriesModel.findOne({ name: newCategory.name })

		if (search) {
			throw new Error("No se pudo agregar la categoría porque ya existe.")
		}

		let response = await CategoriesModel.create(newCategory)
		return response
	}

	async updateCategory(id, categoryData) {
		await CategoriesModel.updateOne({ _id: id }, { $set: categoryData })

		const response = await CategoriesModel.findById(id)
		return response
	}

	async deleteCategory(id) {
		const response = await CategoriesModel.findByIdAndDelete(id)
		if (!response) {
			throw new Error('No se pudo eliminar la categoría')
		}
		return response
	}
}
