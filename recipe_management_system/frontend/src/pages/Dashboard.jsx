import { useSelector, useDispatch } from "react-redux"

function Dashboard() {

    const { user } = useSelector((state) => state.auth)


  return (
    <div>
        <h2>Dashboard Page</h2>
        <p>Welcome {user && user.name}</p>
    </div>
  )
}

export default Dashboard
