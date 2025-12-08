const asyncHandler = require('express-async-handler');
const GroceryList = require('../models/groceryListModel');
const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

const getGroceryList = asyncHandler(async (req, res) => {
  const allLists = await GroceryList.find({
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  })
    .populate('recipes')
    .populate('user', 'name email')
    .populate('sharedWith', 'name email');

  if (allLists.length === 0) {
    const newList = await GroceryList.create({
      user: req.user.id,
      recipes: [],
      customItems: [],
      sharedWith: [],
    });
    
    const populatedNewList = await GroceryList.findById(newList._id)
      .populate('user', 'name email')
      .populate('sharedWith', 'name email');
    
    return res.status(200).json([populatedNewList]);
  }

  res.status(200).json(allLists);
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

  const populatedList = await GroceryList.findById(groceryList._id)
    .populate('recipes')
    .populate('user', 'name email')
    .populate('sharedWith', 'name email');
  res.status(200).json(populatedList);
});

const removeAllItemsFromList = asyncHandler(async (req, res) => {
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

  groceryList.recipes = [];
  groceryList.customItems = [];
  groceryList.checkedIngredients = [];
  await groceryList.save();
  const populatedList = await GroceryList.findById(groceryList._id)
    .populate('recipes')
    .populate('user', 'name email')
    .populate('sharedWith', 'name email');
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
  groceryList.checkedIngredients = [];
  await groceryList.save();

  const populatedList = await GroceryList.findById(groceryList._id).populate('recipes');
  res.status(200).json(populatedList);
});

const addCustomItem = asyncHandler(async (req, res) => {
  const { name, amount, listId } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide item name');
  }

  if (!listId) {
    res.status(400);
    throw new Error('Please provide list ID');
  }

  const groceryList = await GroceryList.findOne({
    _id: listId,
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  });

  if (!groceryList) {
    res.status(404);
    throw new Error('Grocery list not found');
  }

  const newItem = { name, amount: amount || '', checked: false };
  groceryList.customItems.push(newItem);
  await groceryList.save();

  const populatedList = await GroceryList.findById(groceryList._id)
    .populate('recipes')
    .populate('user', 'name email')
    .populate('sharedWith', 'name email');
  res.status(200).json(populatedList);
});

const removeCustomItem = asyncHandler(async (req, res) => {
  const { listId } = req.query;

  if (!listId) {
    res.status(400);
    throw new Error('Please provide list ID');
  }

  const groceryList = await GroceryList.findOne({
    _id: listId,
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

  const populatedList = await GroceryList.findById(groceryList._id)
    .populate('recipes')
    .populate('user', 'name email')
    .populate('sharedWith', 'name email');
  res.status(200).json(populatedList);
});

const toggleCustomItem = asyncHandler(async (req, res) => {
  const { listId } = req.query;

  if (!listId) {
    res.status(400);
    throw new Error('Please provide list ID');
  }

  const groceryList = await GroceryList.findOne({
    _id: listId,
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

  const populatedList = await GroceryList.findById(groceryList._id)
    .populate('recipes')
    .populate('user', 'name email')
    .populate('sharedWith', 'name email');
  res.status(200).json(populatedList);
});

const toggleIngredientChecked = asyncHandler(async (req, res) => {
  const { ingredientName, listId } = req.body;

  if (!ingredientName) {
    res.status(400);
    throw new Error('Please provide ingredient name');
  }

  if (!listId) {
    res.status(400);
    throw new Error('Please provide list ID');
  }

  // Find the specific list by ID and verify user has access
  const groceryList = await GroceryList.findOne({
    _id: listId,
    $or: [
      { user: req.user.id },
      { sharedWith: req.user.id }
    ]
  }).populate('recipes')
    .populate('user', 'name email')
    .populate('sharedWith', 'name email');

  if (!groceryList) {
    res.status(404);
    throw new Error('Grocery list not found');
  }

  const index = groceryList.checkedIngredients.indexOf(ingredientName);
  if (index > -1) {
    groceryList.checkedIngredients.splice(index, 1);
  } else {
    groceryList.checkedIngredients.push(ingredientName);
  }

  await groceryList.save();
  
  // Re-populate all fields after saving
  await groceryList.populate('recipes');
  await groceryList.populate('user', 'name email');
  await groceryList.populate('sharedWith', 'name email');
  
  res.status(200).json(groceryList);
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

  const populatedList = await GroceryList.findById(groceryList._id)
    .populate('recipes')
    .populate('user', 'name email')
    .populate('sharedWith', 'name email');
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

  const populatedList = await GroceryList.findById(groceryList._id)
    .populate('recipes')
    .populate('user', 'name email')
    .populate('sharedWith', 'name email');
  res.status(200).json(populatedList);
});

module.exports = {
  getGroceryList,
  addRecipeToList,
  removeRecipeFromList,
  addCustomItem,
  removeCustomItem,
  removeAllItemsFromList,
  toggleCustomItem,
  toggleIngredientChecked,
  shareGroceryList,
  unshareGroceryList,
};
