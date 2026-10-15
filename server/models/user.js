import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    }

}, { timestamps: true })

userSchema.methods.comparePassword = function (providedPassword) {
    return bcrypt.compare(providedPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User