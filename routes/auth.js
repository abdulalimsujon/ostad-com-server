const express = require('express');
const { register, login, updatedUser } = require('../controllers/auth');
const { requireSignIn, isAdmin } = require('../middlewares/auth');
const router = express.Router();




router.post("/register", register)
router.get("/login", login)
router.get("/auth-check", requireSignIn, (req, res) => {
    res.json({
        status: true
    })


})
router.get('/isAdmin', requireSignIn, isAdmin, (req, res) => {
    res.status({
        status: "true"
    })
})

router.patch('/update', requireSignIn, updatedUser)



module.exports = router; 