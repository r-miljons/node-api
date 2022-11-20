const User = require("../models/userModel");
const Meal = require("../models/mealModel");
const mongoose = require("mongoose");
// json web token will help us determine wether a user is currently logged in
const jwt = require("jsonwebtoken");

// function for creating a signed token
const createToken = (_id) => {
	// sign() takes 3 arguments
	// 1. an object representing the payload of the token, no sensitive information
	// 2. a secret string only known to the server, for decryption/encryption purposes
	// 3. an options object
	return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "999 years" });
};

//login user
const loginUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.login(username, password);

		// if login is successful we create a token and send it along with the username
		const token = createToken(user._id);

		res.status(200).json({ username, id: user._id, token });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

//signup user
const signupUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.signup(username, password);

		// if signup is successful we create a token and send it along with the username
		const token = createToken(user._id);

		res.status(200).json({ username, id: user._id, token });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// get user's meals
const getUserMeals = async (req, res) => {
	const { id } = req.params;
	// pagination
	const page = req.query.page - 1 || 0;
	const mealsPerPage = 6;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Invalid ID" });
	}

	try {

		const mealsCount = await Meal.count({ "user._id": mongoose.Types.ObjectId(id) });
		const meals = await Meal.find({ "user._id": mongoose.Types.ObjectId(id) })
			.sort({ createdAt: -1 })
			.skip(page * mealsPerPage)
			.limit(mealsPerPage);

		res.status(200).json({
				meals,
				total_meals: mealsCount,
				total_pages: Math.ceil(mealsCount / mealsPerPage),
                limit_per_page: mealsPerPage
			});

	} catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
	loginUser,
	signupUser,
	getUserMeals,
};
