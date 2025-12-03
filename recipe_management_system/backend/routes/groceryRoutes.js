const express = require('express');
const router = express.Router();
const {
  getGroceryList,
  addRecipeToList,
  removeRecipeFromList,
  addCustomItem,
  removeCustomItem,
  toggleCustomItem,
  shareGroceryList,
  unshareGroceryList,
} = require('../controllers/groceryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGroceryList);
router.post('/recipe', protect, addRecipeToList);
router.delete('/recipe/:id', protect, removeRecipeFromList);
router.post('/custom', protect, addCustomItem);
router.delete('/custom/:id', protect, removeCustomItem);
router.put('/custom/:id/toggle', protect, toggleCustomItem);
router.post('/share', protect, shareGroceryList);
router.post('/unshare', protect, unshareGroceryList);

module.exports = router;
