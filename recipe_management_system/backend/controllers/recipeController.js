const asyncHandler = require('express-async-handler');

const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

// @desc    Get All Recipes
// @route   GET /api/recipes?filter=mine|shared|all
// @access  Private
const getRecipes = asyncHandler(async (req, res) => {
    const filter = req.query.filter || 'all';
    let recipes;

    if (filter === 'mine') {
        // Only recipes where user is the owner (or user field for backward compatibility)
        recipes = await Recipe.find({
            $or: [
                { owner: req.user.id },
                { user: req.user.id, owner: { $exists: false } }
            ]
        });
    } else if (filter === 'shared') {
        // Only recipes shared with the user (not owned by them)
        recipes = await Recipe.find({ 
            sharedWith: req.user.id,
            $or: [
                { owner: { $ne: req.user.id } },
                { user: { $ne: req.user.id }, owner: { $exists: false } }
            ]
        });
    } else {
        // All recipes: owned by user OR shared with user (with backward compatibility)
        recipes = await Recipe.find({
            $or: [
                { owner: req.user.id },
                { user: req.user.id, owner: { $exists: false } },
                { sharedWith: req.user.id }
            ]
        });
    }

    res.status(200).json(recipes);
});

// @desc    Get Single Recipe
// @route   GET /api/recipes/:id
// @access  Private
const getRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // User must be owner or have recipe shared with them (backward compatible)
    const recipeOwnerId = recipe.owner || recipe.user;
    const isOwner = recipeOwnerId.toString() === req.user.id;
    const isSharedWith = recipe.sharedWith && recipe.sharedWith.some(userId => userId.toString() === req.user.id);

    if (!isOwner && !isSharedWith) {
        res.status(401);
        throw new Error('User not authorized');
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

    const { title, description, ingredients, instructions, prepTime } = requestBody;
    const recipe = await Recipe.create({
        title,
        description,
        ingredients,
        instructions,
        prepTime,
        user: req.user.id,
        owner: req.user.id,
        sharedWith: [],
    });
    res.status(201).json(recipe);
});


// @desc    Update Recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Only owner can update (backward compatible)
    const recipeOwnerId = recipe.owner || recipe.user;
    if (recipeOwnerId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
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

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Only owner can delete (backward compatible)
    const recipeOwnerId = recipe.owner || recipe.user;
    if (recipeOwnerId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await recipe.deleteOne();
    res.status(200).json({ id: req.params.id });
});

// @desc    Share Recipe with Friend
// @route   POST /api/recipes/:id/share
// @access  Private
const shareRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Only owner can share (backward compatible)
    const recipeOwnerId = recipe.owner || recipe.user;
    if (recipeOwnerId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Only the owner can share this recipe');
    }

    const { friendId } = req.body;

    if (!friendId) {
        res.status(400);
        throw new Error('Please provide a friend ID');
    }

    // Verify friend exists
    const friend = await User.findById(friendId);
    if (!friend) {
        res.status(404);
        throw new Error('Friend not found');
    }

    // Check if already shared
    if (recipe.sharedWith.includes(friendId)) {
        res.status(400);
        throw new Error('Recipe already shared with this user');
    }

    // Add friend to sharedWith array
    recipe.sharedWith.push(friendId);
    await recipe.save();

    res.status(200).json(recipe);
});

const unshareRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    const recipeOwnerId = recipe.owner || recipe.user;
    const isOwner = recipeOwnerId.toString() === req.user.id;
    const { friendId } = req.body;

    if (isOwner && friendId) {
        // Owner removing someone from sharedWith
        if (!recipe.sharedWith.includes(friendId)) {
            res.status(400);
            throw new Error('Recipe not shared with this user');
        }
        recipe.sharedWith = recipe.sharedWith.filter(
            (id) => id.toString() !== friendId
        );
    } else if (recipe.sharedWith.some(id => id.toString() === req.user.id)) {
        // User removing themselves from sharedWith
        recipe.sharedWith = recipe.sharedWith.filter(
            (id) => id.toString() !== req.user.id
        );
    } else {
        res.status(401);
        throw new Error('Not authorized to unshare this recipe');
    }

    await recipe.save();
    res.status(200).json(recipe);
});

module.exports = {
    getRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    shareRecipe,
    unshareRecipe,
};