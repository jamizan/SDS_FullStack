const asyncHandler = require('express-async-handler');
const GroceryList = require('../models/groceryListModel');
const Recipe = require('../models/recipeModel');

const getGroceryList = asyncHandler(async (req, res) => {
  const groceryList = await GroceryList.findOne({ user: req.user.id }).populate('recipes');

  if (!groceryList) {
    const newList = await GroceryList.create({
      user: req.user.id,
      recipes: [],
      customItems: [],
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

  let groceryList = await GroceryList.findOne({ user: req.user.id });

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
  const groceryList = await GroceryList.findOne({ user: req.user.id });

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

  let groceryList = await GroceryList.findOne({ user: req.user.id });

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
  const groceryList = await GroceryList.findOne({ user: req.user.id });

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
  const groceryList = await GroceryList.findOne({ user: req.user.id });

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

module.exports = {
  getGroceryList,
  addRecipeToList,
  removeRecipeFromList,
  addCustomItem,
  removeCustomItem,
  toggleCustomItem,
};
