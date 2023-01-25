const express = require('express')
const formidable = require("express-formidable");
const { create, list, read, photo, remove, updateProduct, listProduct, filterProduct, productSearch, relatedProduct } = require('../controllers/product');
const { requireSignIn, isAdmin } = require('../middlewares/auth');

const router = express.Router()


router.post('/product', requireSignIn, isAdmin, formidable(), create)
router.get('/products', list)
router.get('/slugProduct/:slug', read)
router.get('/getPhoto/:id', photo)
router.delete('/remove/:id', requireSignIn, isAdmin, remove)
router.patch('/updateProduct/:id', requireSignIn, isAdmin, formidable(), updateProduct)
router.get('/list/:page', listProduct)
router.get('/filterProducts', filterProduct)
router.get('/products/search/:keyword', productSearch)
router.get('/relatedProduct/:productId/:categoryId', relatedProduct)


module.exports = router;