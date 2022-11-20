require("dotenv").config();
const cors = require("cors");

const express = require("express");
// mongoose allows us to enforce a structure to our db data
const mongoose = require("mongoose");
const mealsRoutes = require("./routes/meals");
const userRoutes = require("./routes/user");

// express app
const app = express();
// middleware
app.use((req, res, next) => {
	console.log(`${req.method} request to ${req.path} by ${req.ip}`);
	next();
});
// CORS allows us to relax the security applied to an API, to access resources from remote hosts.
app.use(cors());
// express.json() detects if the incoming request has a body attached to it and if it does it adds it to the request object,
// so that we can access it inside our request handler functions with "req.body"
app.use(express.json());

// routes
app.use("/api/meals", mealsRoutes);
app.use("/api/user", userRoutes);

// connect to db
mongoose.connect(process.env.MONGODB_URI)
	.then(() => {
		// listen for requests
		app.listen(process.env.PORT, () => {
			console.log(`App live on port ${process.env.PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
