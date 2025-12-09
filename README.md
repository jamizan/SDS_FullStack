# Recipe Management System

A full-stack MERN application for managing recipes, creating grocery lists, and sharing with friends.

## Features

### Recipe Management
- **Create, Read, Update, Delete** recipes with ingredients and instructions
- **Recipe Sharing** - Share your recipes with friends
- **Filter Views** - View your own recipes, shared recipes, or all recipes
- **Recipe Details** - Prep time, ingredients with amounts, step-by-step instructions

### Grocery List
- **Multi-List Support** - Each user can have their own grocery list and access shared lists
- **Automatic Aggregation** - Add recipes to grocery list and automatically aggregate ingredients
- **Custom Items** - Add custom items with amounts to your list
- **Persistent Checkboxes** - Check off items as you shop, state saved to database
- **List Sharing** - Share your grocery list with friends for collaborative shopping
- **List Switching** - Easily switch between your list and shared lists via dropdown

### Friend System
- **Send Friend Requests** - Connect with other users
- **Accept/Reject Requests** - Manage incoming friend requests
- **Remove Friends** - Remove connections when needed
- **Friend Management** - View all your friends and pending requests

### User Authentication
- **Secure Registration & Login** - JWT-based authentication
- **Password Change** - Update your password securely (minimum 4 characters)
- **Protected Routes** - All features require authentication

### User Experience
- **Responsive Design** - Works on desktop and mobile devices
- **Active Navigation** - Color-coded navigation based on current page
- **Real-time Feedback** - Alerts and confirmations for all actions
- **Modern UI** - Clean, professional interface with smooth animations

## Technology Stack

### Frontend
- **React** 19.0.0
- **Redux Toolkit** 2.10.1 - State management
- **React Router** 7.9.6 - Client-side routing
- **Axios** - HTTP requests

### Backend
- **Node.js** & **Express** 5.1.0
- **MongoDB** with **Mongoose** 8.20.0
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jamizan/SDS_FullStack.git
   cd SDS_FullStack/recipe_management_system
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Variables**
   
   Create a `.env` file in the root of `recipe_management_system`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the application**

   **Development mode** (runs both frontend and backend):
   ```bash
   npm run dev
   ```

   **Separate terminals**:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

## Usage

1. **Register** a new account or **Login** with existing credentials
2. **Dashboard** - View your recipe statistics and recent recipes
3. **Recipes Page**
   - Create new recipes with ingredients and instructions
   - Filter by "My Recipes", "Shared with Me", or "All"
   - Edit or delete your recipes
   - Share recipes with friends
   - Add recipes to your grocery list
4. **Grocery List Page**
   - View aggregated ingredients from added recipes
   - Add custom items with amounts
   - Check off items as you shop
   - Share your list with friends
   - Switch between your list and shared lists
5. **Profile Page**
   - Send friend requests by email
   - Manage friend requests and connections
   - Change your password

## Project Structure

```
recipe_management_system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── friendController.js   # Friend operations
│   │   ├── groceryController.js  # Grocery list operations
│   │   ├── recipeController.js   # Recipe CRUD
│   │   └── userController.js     # Authentication
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   ├── friendModel.js        # Friend schema
│   │   ├── groceryListModel.js   # Grocery list schema
│   │   ├── recipeModel.js        # Recipe schema
│   │   └── userModel.js          # User schema
│   ├── routes/
│   │   ├── friendRoutes.js
│   │   ├── groceryRoutes.js
│   │   ├── recipeRoutes.js
│   │   └── userRoutes.js
│   └── server.js                 # Express app entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js          # Redux store
│   │   ├── components/
│   │   │   ├── FriendRequestModal.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── RecipeModal.jsx
│   │   │   ├── RecipeTable.jsx
│   │   │   └── ShareRecipeModal.jsx
│   │   ├── features/
│   │   │   ├── auth/             # Authentication slice
│   │   │   ├── friends/          # Friends slice
│   │   │   ├── grocery/          # Grocery list slice
│   │   │   └── recipes/          # Recipes slice
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Groceries.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Recipes.jsx
│   │   │   └── Register.jsx
│   │   ├── App.js
│   │   ├── index.css             # Global styles
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `PUT /api/users/change-password` - Change password

### Recipes
- `GET /api/recipes?filter=mine|shared|all` - Get recipes
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `POST /api/recipes/:id/share` - Share recipe with friend
- `POST /api/recipes/:id/unshare` - Unshare recipe

### Grocery List
- `GET /api/grocery` - Get all accessible grocery lists
- `POST /api/grocery/recipe` - Add recipe to list
- `DELETE /api/grocery/recipe/:id` - Remove recipe from list
- `POST /api/grocery/custom` - Add custom item
- `DELETE /api/grocery/custom/:id` - Remove custom item
- `PUT /api/grocery/custom/:id/toggle` - Toggle custom item checked
- `PUT /api/grocery/toggle-ingredient` - Toggle ingredient checked
- `POST /api/grocery/share` - Share list with friend
- `POST /api/grocery/unshare` - Unshare list
- `DELETE /api/grocery/all` - Clear all items from list

### Friends
- `GET /api/friends` - Get all friends
- `POST /api/friends/request` - Send friend request
- `GET /api/friends/requests` - Get pending requests
- `PUT /api/friends/accept/:id` - Accept friend request
- `DELETE /api/friends/reject/:id` - Reject friend request
- `DELETE /api/friends/:id` - Remove friend

## Acknowledgments

- Built as part of full-stack development learning course
- MERN stack implementation
- Redux Toolkit for state management
