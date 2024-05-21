import { Router } from 'express'
import CategoryManager from '../dao/mongo/categories.mongo.js'

const CategoriesRouter = Router()
const categoryMngr = new CategoryManager()

CategoriesRouter.get('/', async (req, res) => {
	try {
		const categories = await categoryMngr.getAll()
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
	try {
		const newCategory = await categoryMngr.createCategory(req.body)
		res.status(201).json(newCategory)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

CategoriesRouter.put('/:id', async (req, res) => {
	try {
		const categoryId = req.params.id
		const updatedCategory = await categoryMngr.updateCategory(categoryId, req.body)
		res.json(updatedCategory)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

CategoriesRouter.delete('/:id', async (req, res) => {
	try {
		const categoryId = req.params.id
		const response = await categoryMngr.deleteCategory(categoryId)
		res.json(response)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

export default CategoriesRouter
