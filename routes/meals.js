const express = require("express");
const {
	createMeal,
	getMeals,
	getMeal,
	deleteMeal,
	updateMeal,
} = require("../controllers/mealController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// after instanciating the router, we apply the middleware to the routes
// .use() will fire this middleware before everything else the router does
// therefore if a user wants to perform any of these requests, they will have to have a valid authentication header sent with the request

// in order to use the middleware for all of the routes, we would do .use()
// but since I want to exclude the middleware from certain routes, I found that the easiest way is to specify the middleware for each route separately

//router.use(requireAuth);

// GET all meals
router.get("/", getMeals);

// GET a single meal
router.get("/:id", getMeal);

// POST a new meal
router.post("/", requireAuth, createMeal);

// DELETE a single meal
router.delete("/:id", requireAuth, deleteMeal);

// PATCH a single meal ( update )
router.patch("/:id", requireAuth, updateMeal);

module.exports = router;
