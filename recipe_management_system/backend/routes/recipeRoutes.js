const express = require('express');
const router = express.Router();
const { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, shareRecipe, unshareRecipe } = require('../controllers/recipeController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRecipes).post(protect, createRecipe);
router.route('/:id').get(protect, getRecipe);
router.route('/:id').put(protect, updateRecipe).delete(protect, deleteRecipe);
router.route('/:id/share').post(protect, shareRecipe);
router.route('/:id/unshare').post(protect, unshareRecipe);

module.exports = router;