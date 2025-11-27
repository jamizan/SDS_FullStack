import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

function Menu() {
  const { user } = useSelector((state) => state.auth)
  
  if (!user) {
    return null
  }

  return (
    <div className="menu">
      <Link to="/">Home</Link>
      <Link to="/recipes">All Recipes</Link>
      <Link to="/groceries">Groceries</Link>
    </div>
  )
}

export default Menu
