const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        ingredients: {
            type: [String],
            required: [true, 'Please add ingredients'],
        },
        instructions: {
            type: String,
            required: [true, 'Please add instructions'],
        },
        prepTime: {
            type: Number,
            required: [true, 'Please add preparation time in minutes'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Recipe', recipeSchema);