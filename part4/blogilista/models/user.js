const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        minlength: 3,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedUser) => {
    returnedUser.id = returnedUser._id.toString()
    delete returnedUser._id
    delete returnedUser.__v
    delete returnedUser.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)