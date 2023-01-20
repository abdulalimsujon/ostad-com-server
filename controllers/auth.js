const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/auth");
const User = require("../models/user");



exports.register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name.trim()) {
            return res.json({ error: 'name is required' })
        }

        if (!email) {
            return res.json({ error: "email is required" })
        }

        if (!password && password.length < 6) {
            return res.json({ error: 'password must be 6 characters' })
        }

        const existUser = await User.findOne({ email: email })
        if (existUser) {
            res.json({ error: "Email is taken" })
        }


        //hashed password 

        const hashedPassword = await hashPassword(password)

        const user = await new User({
            name,
            email,
            password: hashedPassword,

        }).save();

        //create token

        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRATE, { expiresIn: '7d' });



        res.json(
            {
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    address: user.address
                },

                token
            })

    } catch (error) {

        console.log(error)

    }

}

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;


        if (!email) {
            return res.json({ error: "email is required" })
        }

        if (!password || password.length < 6) {
            return res.json({ error: 'password must be 6 characters' })
        }

        const user = await User.findOne({ email: email })


        const match = await comparePassword(password, user.password)

        if (!match) {
            res.json({ error: "wrong email or password" })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRATE, {
            expiresIn: "7d",
        });
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.adress
            },
            token

        })



    } catch (error) {
        console.log(error)

    }



}

