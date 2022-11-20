// controller files contain all the route handler functions

const Meal = require("../models/mealModel");
const mongoose = require("mongoose");
const validateURL = require("../utils/validateURL");

// Get all meals
const getMeals = async (req, res) => {
	// pagination
	const page = req.query.page - 1 || 0;
	const mealsPerPage = 8;
	try {
		const mealsCount = await Meal.count({});
		const meals = await Meal.find({})
			// sort in descending order (newest first)
			.sort({ createdAt: -1 })
			.skip(page * mealsPerPage)
			.limit(mealsPerPage);
		res.status(200).json({
				meals,
				total_meals: mealsCount,
				total_pages: Math.ceil(mealsCount / mealsPerPage),
				limit_per_page: mealsPerPage,
			});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get a single meal
const getMeal = async (req, res) => {
	const { id } = req.params;

	// we first need to verify that the ID is valid, otherwise we will crash the app
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Invalid ID" });
	}

	// use the mongoose findById method and pass in the valid ID
	const meal = await Meal.findById(id);

	// if meal returns null, then no such document exists, we return out of the function and respond with a 404
	if (!meal) {
		return res.status(404).json({ error: "No data found" });
	}

	res.status(200).json(meal);
};

// Create a meal
const createMeal = async (req, res) => {
	const { title, calories, picture } = req.body;

	// handle errors (if required fields are invalid, picture is not a required field)
	let invalidFields = [];
	if (!title) {
		invalidFields.push("Title");
	}
	if (!calories) {
		invalidFields.push("Calories");
	}
	// error if picture is provided but the url is not valid
	if (picture && !validateURL(picture)) {
		invalidFields.push("Picture");
	}
	if (invalidFields.length > 0) {
		// send back error message and the fields that are invalid
		return res.status(400).json({
			error:
				"Please fill in all of the fields" +
				(invalidFields.includes("Picture") ? ", provided URL is invalid" : ""),
			invalidFields,
		});
	}

	// we try to create a new meal document
	try {
		// .create() is async, so we put await keyword before it and turn the response handler function into async function
		// once the document is created, we get the newly created document with it's ID in the response "meal"
		// ! previously we created a user property on the request object, using our own middleware
		const user = req.user;
		const meal = await Meal.create({ title, calories, picture, user });
		// we respond with the newly created document
		res.status(200).json(meal);
		// and we catch the error if something goes wrong
	} catch (error) {
		// status 400 = bad request // send the message property of the error object
		res.status(400).json({ error: error.message });
	}
};

// Update a meal
const updateMeal = async (req, res) => {
	const { id } = req.params;
	const { title, calories, picture } = req.body;

	// handle errors (if required fields are invalid, picture is not a required field)
	let invalidFields = [];
	if (!title) {
		invalidFields.push("Title");
	}
	if (!calories) {
		invalidFields.push("Calories");
	}
	// error if picture is provided but the url is not valid
	if (picture && !validateURL(picture)) {
		invalidFields.push("Picture");
	}
	if (invalidFields.length > 0) {
		// send back error message and the fields that are invalid
		return res.status(400).json({
			error:
				"Please fill in all of the fields" +
				(invalidFields.includes("Picture") ? ", provided URL is invalid" : ""),
			invalidFields,
		});
	}

	// check if  the id is valid
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Invalid ID" });
	}

	const meal = await Meal.findByIdAndUpdate(id, { ...req.body });

	if (!meal) {
		return res.status(404).json({ error: "No data found" });
	}

	res.status(200).json(meal);
};

// Delete a meal
const deleteMeal = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Invalid ID" });
	}

	const meal = await Meal.findById(id);

	if (!meal) {
		// respond with error if the meal does not exist
		return res.status(404).json({ error: "No data found" });

		// check if the one who is sending the request is the one who created the meal
		// compare two object id's by using the equals() method, every instance of ObjectId contains it.
	} else if (req.user._id.equals(meal.user._id)) {
		// delete the meal if so
		await Meal.findByIdAndDelete(id);
	}

	res.status(200).json(meal);
};

module.exports = {
	getMeal,
	getMeals,
	createMeal,
	deleteMeal,
	updateMeal,
};
