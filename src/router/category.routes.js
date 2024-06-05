import { Router } from 'express'
import CategoryManager from '../dao/mongo/categories.mongo.js'
import CategoryDTO from '../dao/DTOs/category.dto.js'

const CategoriesRouter = Router()
const categoryMngr = new CategoryManager()

CategoriesRouter.get('/', async (req, res) => {
	try {
		const categories = await categoryMngr.get()
		res.json(categories)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

CategoriesRouter.get('/:id', async (req, res) => {
	try {
		const categoryId = req.params.id
		const category = await categoryMngr.getById(categoryId)
		if (!category) {
			return res.status(404).json({ message: 'Category not found' })
		}
		res.json(category)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

CategoriesRouter.post('/', async (req, res) => {
	const categoryData = req.body

	try {
		const newCategory = new CategoryDTO(categoryData)
		res.status(201).json(await categoryMngr.create(newCategory))
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

CategoriesRouter.put('/:id', async (req, res) => {
	try {
		const categoryId = req.params.id
		const updatedCategory = await categoryMngr.update(categoryId, req.body)
		res.json(updatedCategory)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

CategoriesRouter.delete('/:id', async (req, res) => {
	try {
		const categoryId = req.params.id
		const response = await categoryMngr.delete(categoryId)
		res.json(response)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

export default CategoriesRouter
