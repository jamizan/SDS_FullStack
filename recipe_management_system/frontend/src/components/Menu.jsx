import { Link } from "react-router-dom"

function Menu() {
  return (
    <div className="menu">
      <Link to="/">Home</Link>
      <Link to="/recipes">All Recipes</Link>
      <Link to="/groceries">Groceries</Link>
    </div>
  )
}

export default Menu
