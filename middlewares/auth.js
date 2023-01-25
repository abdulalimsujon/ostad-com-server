

const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.requireSignIn = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRATE)
        req.user = decoded;
        next()
    } catch (error) {
        res.status(400).json({ error: error })
    }
}

exports.isAdmin = async (req, res, next) => {

    try {
        const user = await User.findById(req.user._id)
        if (user) {
            if (user.role !== 1) {
                res.json({ error: "not authorized" })

            } else {

                next()
            }
        }
    } catch (error) {
        res.json({ error: error })
    }


}