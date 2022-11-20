const mongoose = require('mongoose');
// mongoDB alone is schema-less, mongoose allows us to create schemas, as a wrapper for mongoDB

// the schema takes two arguments 
// 1. is how the document will look like,
// 2. is the options object
const mealsSchema = new mongoose.Schema({
    // define your document fields here
    title: {
        // field requirements
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
    picture: String,
    user: {
        type: Object,
        required: true,
    },
}, {
    // creates a field for when the document was created and updated
    timestamps: true,
});

// Define a model - a programming interface for interacting with the database
// a schema answers "what will the data in this collection look like?" and a model provides FUNCTIONALITY, like, "Are there any records matching this query?" or "Add a new document to the collection".

// mongoose will auto-create the collection and pluralize the name of the collection to "Meals"
// used OR operator because of some wierd override error when trying to import the module in two different paths
module.exports = mongoose.model.Meal || mongoose.model("Meal", mealsSchema);

// we then use this "Meal" model to interact with the "Meals" collection
// Meal.find()
