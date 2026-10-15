import mongoose from 'mongoose'

const connectDB = async () => {
    const mongoDbUri = process.env.MONGODB_URI?.trim()

    if (!mongoDbUri) {
        throw new Error('MONGODB_URI environment variable is not set')
    }

    if (mongoDbUri.includes('<') || mongoDbUri.includes('>')) {
        throw new Error('MONGODB_URI still contains an unresolved placeholder')
    }

    try {
        await mongoose.connect(mongoDbUri, {
            dbName: 'ResumeBuilder',
            serverSelectionTimeoutMS: 10000
        })

        console.log('MongoDB connected successfully')
    } catch (error) {
        const reason = error.reason?.message || error.message || 'Unknown MongoDB connection error'
        console.error(`MongoDB connection failed: ${reason}`)
        throw error
    }
}

export default connectDB