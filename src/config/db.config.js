import mongoose from "mongoose"

const DB_URL = 'mongodb+srv://cecic24:4193531@codercluster.8naffdo.mongodb.net/ecommerce'

const connectDb = async () => {
	try {
		await mongoose.connect(DB_URL)
		console.log('Database connected')
	} catch (error) {
		console.error('Error connecting to the database:', error.message)
		process.exit()
	}
}

export default connectDb