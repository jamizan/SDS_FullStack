import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"

function Menu() {
  const { user } = useSelector((state) => state.auth)
  
  if (!user) {
    return null
  }

  return (
    <div className="menu">
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
      <NavLink to="/recipes" className={({ isActive }) => isActive ? 'active' : ''}>Recipes</NavLink>
      <NavLink to="/groceries" className={({ isActive }) => isActive ? 'active' : ''}>Groceries</NavLink>
    </div>
  )
}

export default Menu
