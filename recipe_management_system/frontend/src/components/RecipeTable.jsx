function RecipeTable({ recipes, showActions = true, columns = ['name', 'cuisine', 'time'] }) {
  return (
    <table className="recipe-table">
      <thead>
        <tr>
          {columns.includes('name') && <th>Recipe Name</th>}
          {columns.includes('cuisine') && <th>Cuisine</th>}
          {columns.includes('time') && <th>Preparation Time</th>}
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe) => (
          <tr key={recipe.id}>
            {columns.includes('name') && <td>{recipe.title}</td>}
            {columns.includes('cuisine') && <td>{recipe.cuisine}</td>}
            {columns.includes('time') && <td>{recipe.prepTime}</td>}
            {showActions && (
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RecipeTable;