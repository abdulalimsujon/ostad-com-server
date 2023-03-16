const jwt = require("jsonwebtoken");
const { comparePassword, hashPassword } = require("../helpers/auth");


const User = require("../models/user");



exports.register = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        if (!name) {
            return res.json({ error: 'name is required' })
        }

        if (!email) {
            return res.json({ error: "email is required" })
        }

        if (!password && password.length < 6) {
            return res.json({ error: 'password must be 6 characters' })
        }

        const existUser = await User.findOne({ email: email })
        console.log(existUser);
        if (existUser) {
            res.json({ error: "Email is taken" })
        }


        //hashed password 

        const hash = await hashPassword(password)

        const user = await new User({
            name,
            email,
            password: hash,
            role


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
        const { email, password, role } = req.body;

        console.log(email, password);


        if (!email) {
            return res.json({ error: "email is required" })
        }

        if (!password || password.length < 6) {
            return res.json({ error: 'password must be 6 characters' })
        }

        const user = await User.findOne({ email })

        console.log("====>", user);





        // const match = await comparePassword(password, user.password)

        // console.log(user.password)

        // if (!match) {
        //     res.json({ error: "wrong email or password" })
        // }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRATE, {
            expiresIn: "7d",
        });
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token,
        });




    } catch (error) {
        console.log(error)

    }
}

exports.updatedUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;
        const user = await User.findById(req.user._id);

        if (!name && !email) {
            res.status(400).json({ message: "Enter email and name" })
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Atleast 6 charatcher is needed" })
        }

        //hash the password
        const hash = password ? await hashPassword(password) : undefined

        const updatedUser = await User.findByIdAndUpdate(req.user._id, {

            name: name || user.name,
            email: email || user.email,
            password: hash || user.password,


        }, {
            new: true
        })

        updatedUser.password = undefined
        res.json(updatedUser)
    } catch (error) {

        console.log(error)

    }

}

