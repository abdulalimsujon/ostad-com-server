
const { default: slugify } = require('slugify');
const Product = require('../models/product')
const fs = require('fs')

exports.create = async (req, res) => {

    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name?.trim():
                return res.json({ error: "name is required" })
            case !description?.trim():
                return res.json({ error: "description  is required" })
            case !price?.trim():
                return res.json({ error: "price is required" })
            case !category?.trim():
                return res.json({ error: "category is required" })
            case !quantity?.trim():
                return res.json({ error: "quantity is required" })
            case !shipping?.trim():
                return res.json({ error: "shipping is required" })
            case photo && photo.size > 1000000:
                return res.json({ error: "image should be less than 1mb" })
        }

        const product = new Product({ ...req.fields, slug: slugify(name) })

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        await product.save()

        res.send(product)

    } catch (error) {
        console.log(error)
        res.json({ error: error })

    }
}

exports.list = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('category')
            .select('-photo')
            .limit(6)
            .sort({ createdAt: -1 });

        res.json(products)

    } catch (error) {
        console.log(error)
    }
}

exports.read = async (req, res) => {

    try {
        const slug = req.params.slug
        const product = await Product.findOne({ slug })
        res.json({ product: product })

    } catch (error) {
        console.log(error)

        res.json({ error: error })
    }

}

exports.photo = async (req, res) => {

    try {
        const id = req.params.id;

        const product = await Product.findOne({ _id: id }).select('photo')
        if (product.photo.data) {
            res.set('contentType', product.photo.contentType)

            return res.send(product.photo.data)
        }
    } catch (error) {
        res.json({ error: error })
    }

}

exports.remove = async (req, res) => {

    try {
        const id = req.params.id;
        console.log(id)
        const removeItem = await Product.findByIdAndDelete(id).select('-photo')
        res.json(removeItem)


    } catch (error) {
        console.log(error)
    }

}
exports.updateProduct = async (req, res) => {

    try {

        const id = req.params.id
        console.log(id)
        const { photo } = req.files;
        const { name, description, price, category, quantity, sold, shipping } = req.fields;

        switch (true) {
            case !name?.trim():
                return res.json({ error: "name is required" })
            case !description?.trim():
                return res.json({ error: "description is required" })
            case !price?.trim():
                return res.json({ error: 'price is required' })
            case !category?.trim():
                return res.json({ error: 'category is required' })
            case !quantity?.trim():
                return res.json({ error: 'quzntity is required' })
            case !sold?.trim():
                return res.json({ error: 'sold is required' })
            case !shipping?.trim():
                return res.json({ error: 'shipping is required' })
        }

        const product = await Product.findByIdAndUpdate(id,
            {
                ...req.fields,
                slug: slugify(name)
            },

            {
                new: true
            }


        )

        if (photo) {

            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.contentType;

        }

        await product.save()

        res.json(product)

    } catch (error) {

        console.log(error)

    }
}

exports.listProduct = async (req, res) => {
    try {

        const page = req.params.page ? req.params.page : 1;

        const perpage = 6;
        const products = await Product.find({})
            .select('-photo')
            .skip((page - 1) * perpage)
            .limit(perpage)
            .sort({ createAt: -1 })

        res.json(products)


    } catch (error) {
        res.json({ error: error })
    }
}

exports.filterProduct = async (req, res) => {
    try {
        const { check, radio } = req.body;
        const args = {}
        if (check.length > 0) args.category = check;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }

        const products = await Product.find(args)
        res.json(products)

    } catch (error) {
        console.log(error)
    }
}

exports.productSearch = async (req, res) => {
    try {
        const { keyword } = req.params;

        const products = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]

        })

        res.json(products)

    } catch (error) {
        console.log(error)
    }
}

exports.relatedProduct = async (req, res) => {

    try {
        const { productId, categoryId } = req.params;

        const related = await Product.find({
            category: categoryId,
            $ne: { _id: productId }

        })

        res.json(related)

    } catch (error) {
        console.log(error)
    }




}

