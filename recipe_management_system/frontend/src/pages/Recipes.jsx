import RecipeTable from "../components/RecipeTable"

function Recipes() {
  return (
    <div className="recipes-container">
        <h2>Recipes Page</h2>
        <p>List of all recipes will be displayed here.</p>
        <RecipeTable recipes={[]} />
    </div>
  )
}

export default Recipes
