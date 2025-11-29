const mongoose = require('mongoose');

const groceryListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
    customItems: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: String,
          default: '',
        },
        checked: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GroceryList', groceryListSchema);
