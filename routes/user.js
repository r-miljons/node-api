const express = require('express');
// controller functions
const { loginUser, signupUser, getUserMeals } = require("../controllers/userController");

const router = express.Router();

// GET user meals
router.get('/meals/:id', getUserMeals)

// login
router.post("/login", loginUser);

// signup
router.post("/signup", signupUser);

module.exports = router;