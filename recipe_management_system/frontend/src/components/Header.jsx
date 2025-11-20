import {Link, useNavigate} from 'react-router-dom'

function Header() {
  return (
    <header className='heading'>
        <div className="logo">
            <Link to='/'>Recipe Management System</Link>
        </div>
        <div className="login">
            <Link to='/login'>Login</Link>
        </div>
        <div className="register">
            <Link to='/register'>Register</Link>
        </div>
    </header>
  )
}

export default Header
