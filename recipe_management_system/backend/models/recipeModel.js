const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        ingredients: {
            type: [String],
            required: [true, 'Please add ingredients'],
        },
        instructions: {
            type: String,
            required: [true, 'Please add instructions'],
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