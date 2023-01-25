const mongoose = require('mongoose')

const categoryModel = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            trim: true,
            required: true,
            maxLength: 32
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        }

    },
    {
        timeStamps: true, versionKey: false
    }
)

const Category = mongoose.model('Category', categoryModel)

module.exports = Category;