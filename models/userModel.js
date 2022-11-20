const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

// static signup method
userSchema.statics.signup = async function (username, password) {

	// input validation
	if (!username || !password) {
		throw Error("All fields are required");
	}
	if (!validator.isAlphanumeric(username)) {
		throw Error("Username can only include letters and numbers");
	}
	if (!validator.isStrongPassword(password, {
			minLength: 4,
			minLowercase: 0,
			minUppercase: 0,
			minSymbols: 0,
			minNumbers: 0,
		})) {
		throw Error("Password must be at least 4 characters long");
	}

	// check if the username already exists
	const exists = await this.findOne({ username });
	if (exists) {
		// if it does, then throw and error, which we can catch in the request handler
		throw Error("Username already in use");
	}

	// salt is a random string added to the hash, it takes the number argument of cost, the higher the cost the longer the function takes
	// the longer it takes the harder it is to brute force the password, but also the signup process is longer
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	// store the user in the db
	const user = await this.create({ username, password: hash });

	return user;
};

// static login method
userSchema.statics.login = async function(username, password) {

    // input validation
	if (!username || !password) {
		throw Error("All fields are required");
	}

    // check if the user is registered
	const user = await this.findOne({ username });
	if (!user) {
		// if not, then throw and error, which we can catch in the request handler
		throw Error("Invalid username or password");
	}

    // check if passwords match using bcrypt compare() method, which is async
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        // sending identical errors for security purposes
        throw Error("Invalid username or password");
    }

    return user;
};

module.exports = mongoose.model("User", userSchema);
