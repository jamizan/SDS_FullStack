import {Link, useNavigate} from 'react-router-dom'
import {FaSignInAlt, FaUser, FaSignOutAlt} from 'react-icons/fa'
import {useSelector, useDispatch} from 'react-redux'
import {logout, reset} from '../features/auth/authSlice'
import Menu from './Menu.jsx'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='heading'>
        <div className='menu-container'>
          <Menu />
        </div>
        <div className="user-links">
          {user ? (
            <>
              <p>Welcome {user.name}</p>
              <button onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <div className="login">
                <Link to='/login'>
                  <FaSignInAlt /> Login
                </Link>
              </div>
              <div className="register">
                <Link to='/register'>
                  <FaUser /> Register
                </Link>
              </div>
            </>
          )}
        </div>    </header>
  )
}

export default Header
