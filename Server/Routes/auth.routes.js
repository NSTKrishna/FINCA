const express = require("express");
const router = express.Router();

const {access} = require("../Controllers/login.controller");
const {register} = require("../Controllers/signup.controller");
const {authMiddleware} = require("../MIddlewares/auth.middleware");

router.post("/login", access);
router.post("/signup", register);
router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;