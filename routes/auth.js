const express = require('express');
const { register, login, updatedUser } = require('../controllers/auth');
const { requireSignIn, isAdmin } = require('../middlewares/auth');
const router = express.Router();




router.post("/register", register)
router.post("/login", login)
router.get("/auth-check", requireSignIn, (req, res) => {
    res.status(200).json({
        ok: true
    })


})
router.get('/isAdmin', requireSignIn, isAdmin, (req, res) => {
    res.status(200).json({
        ok: true
    })
})

router.patch('/update', requireSignIn, updatedUser)



module.exports = router; 