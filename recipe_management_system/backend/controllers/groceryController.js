const asyncHandler = require('express-async-handler');
const GroceryList = require('../models/groceryListModel');
const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

const getGroceryList = asyncHandler(async (req, res) => {
  // Find grocery list owned by user or shared with user
  let groceryList = await GroceryList.findOne({
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  }).populate('recipes');

  if (!groceryList) {
    const newList = await GroceryList.create({
      user: req.user.id,
      recipes: [],
      customItems: [],
      sharedWith: [],
    });
    return res.status(200).json(newList);
  }

  res.status(200).json(groceryList);
});

const addRecipeToList = asyncHandler(async (req, res) => {
  const { recipeId } = req.body;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  let groceryList = await GroceryList.findOne({
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  });

  if (!groceryList) {
    groceryList = await GroceryList.create({
      user: req.user.id,
      recipes: [recipeId],
      customItems: [],
    });
  } else {
    const recipeExists = groceryList.recipes.some(
      (id) => id.toString() === recipeId
    );
    if (!recipeExists) {
      groceryList.recipes.push(recipeId);
      await groceryList.save();
    }
  }

  const populatedList = await GroceryList.findById(groceryList._id).populate('recipes');
  res.status(200).json(populatedList);
});

const removeRecipeFromList = asyncHandler(async (req, res) => {
  const groceryList = await GroceryList.findOne({
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  });

  if (!groceryList) {
    res.status(404);
    throw new Error('Grocery list not found');
  }

  groceryList.recipes = groceryList.recipes.filter(
    (id) => id.toString() !== req.params.id
  );
  await groceryList.save();

  const populatedList = await GroceryList.findById(groceryList._id).populate('recipes');
  res.status(200).json(populatedList);
});

const addCustomItem = asyncHandler(async (req, res) => {
  const { name, amount } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide item name');
  }

  let groceryList = await GroceryList.findOne({
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  });

  if (!groceryList) {
    groceryList = await GroceryList.create({
      user: req.user.id,
      recipes: [],
      customItems: [{ name, amount: amount || '', checked: false }],
    });
  } else {
    groceryList.customItems.push({ name, amount: amount || '', checked: false });
    await groceryList.save();
  }

  const populatedList = await GroceryList.findById(groceryList._id).populate('recipes');
  res.status(200).json(populatedList);
});

const removeCustomItem = asyncHandler(async (req, res) => {
  const groceryList = await GroceryList.findOne({
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  });

  if (!groceryList) {
    res.status(404);
    throw new Error('Grocery list not found');
  }

  groceryList.customItems = groceryList.customItems.filter(
    (item) => item._id.toString() !== req.params.id
  );
  await groceryList.save();

  const populatedList = await GroceryList.findById(groceryList._id).populate('recipes');
  res.status(200).json(populatedList);
});

const toggleCustomItem = asyncHandler(async (req, res) => {
  const groceryList = await GroceryList.findOne({
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  });

  if (!groceryList) {
    res.status(404);
    throw new Error('Grocery list not found');
  }

  const item = groceryList.customItems.id(req.params.id);
  if (item) {
    item.checked = !item.checked;
    await groceryList.save();
  }

  const populatedList = await GroceryList.findById(groceryList._id).populate('recipes');
  res.status(200).json(populatedList);
});

const shareGroceryList = asyncHandler(async (req, res) => {
  const groceryList = await GroceryList.findOne({ user: req.user.id });

  if (!groceryList) {
    res.status(404);
    throw new Error('Grocery list not found');
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
  if (groceryList.sharedWith.includes(friendId)) {
    res.status(400);
    throw new Error('Grocery list already shared with this user');
  }

  // Add friend to sharedWith array
  groceryList.sharedWith.push(friendId);
  await groceryList.save();

  const populatedList = await GroceryList.findById(groceryList._id).populate('recipes');
  res.status(200).json(populatedList);
});

const unshareGroceryList = asyncHandler(async (req, res) => {
  const { friendId } = req.body;

  let groceryList;

  if (friendId) {
    groceryList = await GroceryList.findOne({ user: req.user.id });

    if (!groceryList) {
      res.status(404);
      throw new Error('Grocery list not found');
    }

    groceryList.sharedWith = groceryList.sharedWith.filter(
      (id) => id.toString() !== friendId
    );
  } else {
    groceryList = await GroceryList.findOne({ sharedWith: req.user.id });

    if (!groceryList) {
      res.status(404);
      throw new Error('Grocery list not found or not shared with you');
    }

    groceryList.sharedWith = groceryList.sharedWith.filter(
      (id) => id.toString() !== req.user.id
    );
  }

  await groceryList.save();

  const populatedList = await GroceryList.findById(groceryList._id).populate('recipes');
  res.status(200).json(populatedList);
});

module.exports = {
  getGroceryList,
  addRecipeToList,
  removeRecipeFromList,
  addCustomItem,
  removeCustomItem,
  toggleCustomItem,
  shareGroceryList,
  unshareGroceryList,
};
