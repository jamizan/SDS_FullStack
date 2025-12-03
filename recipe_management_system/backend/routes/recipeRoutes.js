const express = require('express');
const router = express.Router();
const { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, shareRecipe } = require('../controllers/recipeController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRecipes).post(protect, createRecipe);
router.route('/:id').get(protect, getRecipe);
router.route('/:id').put(protect, updateRecipe).delete(protect, deleteRecipe);
router.route('/:id/share').post(protect, shareRecipe);

module.exports = router;