
const express = require('express');
const { createCategory, categoryUpdate, Remove, productByCategory, list } = require('../controllers/category');
const { requireSignIn, isAdmin } = require('../middlewares/auth');


const router = express.Router()

router.post('/createCategory', requireSignIn, isAdmin, createCategory)
router.put('/updateCategory/:id', requireSignIn, isAdmin, categoryUpdate)
router.delete('/remove/:id', requireSignIn, isAdmin, Remove)
router.get('/categories', list)
router.get('/getCategory/:slug', requireSignIn, isAdmin, productByCategory)



module.exports = router;