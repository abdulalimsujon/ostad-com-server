const { default: slugify } = require("slugify");
const Category = require("../models/category");


exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name.trim()) {
            res.json({ error: "name is required" })

        }

        const exist = await Category.findOne({ name })

        if (exist) {
            res.json({ error: "Already exist!!" })

        }

        const category = await new Category({ name, slug: slugify(name) }).save();

        res.json(category)



    } catch (err) {
        console.log(err)
    }

}
exports.categoryUpdate = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        const update = await Category.findByIdAndUpdate(
            id,
            {
                name,
                slug: slugify(name)

            },
            {
                new: true
            }
        )

        res.json(update)

    } catch (error) {
        console.log(error)
    }
}

exports.Remove = async (req, res) => {
    try {
        const remove = await Category.findByIdAndDelete(req.params.id)
        res.json(remove)

    } catch (error) {
        res.status({ "error": error.message })
    }
}


exports.read = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        res.json(category);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

exports.list = async (req, res) => {
    try {
        const all = await Category.find({});
        res.json(all);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};


exports.productByCategory = async (req, res) => {

    try {

        const category = await Category.findOne({ slug: req.params.slug })
        if (category) {
            res.json(category)
        } else {
            res.json({ "error": error.message })
        }
    } catch (error) {
        console.log(error)
    }

}