const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 66
    },
    address: {
        type: String,
        trim: true
    },
    role: {
        type: Number,
        default: 0
    }




}, {
    timeStamps: true, versionKey: false

})

const User = mongoose.model('User', userSchema)

module.exports = User