import CategoriesModel from "./models/categories.model.js"

export default class CategoryManager {
	constructor() {}

	async get() {
		const response = await CategoriesModel.find()
		return response
	}

	async getById(id) {
		const response = await CategoriesModel.findById(id)
		return response
	}

	async create(newCategory) {
		const search = await CategoriesModel.findOne({ name: newCategory.name })

		if (search) {
			throw new Error("No se pudo agregar la categoría porque ya existe.")
		}

		let response = await CategoriesModel.create(newCategory)
		return response
	}

	async update(id, categoryData) {
		await CategoriesModel.updateOne({ _id: id }, { $set: categoryData })

		const response = await CategoriesModel.findById(id)
		return response
	}

	async delete(id) {
		const response = await CategoriesModel.findByIdAndDelete(id)
		if (!response) {
			throw new Error('No se pudo eliminar la categoría')
		}
		return response
	}
}
