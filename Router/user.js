const router = require("express").Router()
const User = require("../Modals/user")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWTSEC = "#2@!@$kjsdhsjd"

router.post("/create/user", body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('username').isLength({ min: 5 }),
    body('phonenumber').isLength({ min: 10 }),
    async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json("please check input length")
        }
        try {


            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json("email is already use")
            }
            var salt = await bcrypt.genSalt(10);
            const secpass = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: secpass,
                profile: req.body.profile,
                phonenumber: req.body.phonenumber,
            })
            const accessToken = await jwt.sign({
                id: user._id,
                username: user.username
            }, JWTSEC)
            await user.save()
            res.status(200).json({ user, accessToken })
        } catch (error) {
            return res.status(400).json("Internal error occured")
        }
    }
)
// login
router.post("/login", body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json("please check credential")
        }
        try {


            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json("User does'nt found")
            }
            const comparePassword = await bcrypt.compare(req.body.password, user.password)
            if (!comparePassword) {
                return res.status(400).json("Password error")
            }
            const accessToken = await jwt.sign({
                id: user._id,
                username: user.username
            }, JWTSEC)
            //destructure form user data remove password
            const { password, ...userdata } = user._doc
            res.status(200).json({ userdata, accessToken })
        } catch (error) {
            return res.status(400).json("Internal error occured")
        }
    })
module.exports = router