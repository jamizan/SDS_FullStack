const asyncHandler = require('express-async-handler');

const Recipe = require('../models/recipeModel');

// @desc    Get All Recipes
// @route   GET /api/recipes
// @access  Private
const getRecipes = asyncHandler(async (req, res) => {
    const recipes = await Recipe.find({ user: req.user.id });
    res.status(200).json(recipes);
});

// @desc    Get Single Recipe
// @route   GET /api/recipes/:id
// @access  Private
const getRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (recipe.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }
    res.status(200).json(recipe);
});

// @desc    Create Recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = asyncHandler(async (req, res) => {
    const requestBody = req.body || {};

    if (!requestBody.title || !requestBody.ingredients || !requestBody.instructions) {
        res.status(400);
        throw new Error('Please add all required fields: title, ingredients, instructions');
    }

    const { title, ingredients, instructions } = requestBody;
    const recipe = await Recipe.create({
        title,
        ingredients,
        instructions,
        user: req.user.id,
    });
    res.status(201).json(recipe);
});


// @desc    Update Recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (recipe.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updatedRecipe);
});

// @desc    Delete Recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (recipe.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    await recipe.deleteOne();
    res.status(200).json({ id: req.params.id });
});


module.exports = {
    getRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
};