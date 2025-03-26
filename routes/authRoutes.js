const express = require("express")
const userRoutes = express.Router();

const {Login, getLogin, Register, getRegister} = require("../controllers/authController")

userRoutes.get("/login", getLogin)

userRoutes.get("/register", getRegister)


userRoutes.post("/register", Register)

userRoutes.post("/login", Login)

module.exports = userRoutes