
const { readdirSync } = require("fs");
const path = require('path')
const express = require('express')
const app = express()


const mongoose = require('mongoose')
require('dotenv').config()

const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')


//middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(helmet())
app.use(express.urlencoded({ extended: false }));


//routes middlewares

readdirSync('./routes').map(r => app.use('/api/v1', require(`./routes/${r}`)))


//server 
const port = process.env.PORT || 8000


mongoose
    .connect(process.env.STRING)
    .then(() => {
        app.listen(port, () => {
            console.log('app is running on port ', port)
        })
    })
    .catch((err) => {
        console.log('mongoose error ', err)
    })

