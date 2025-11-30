

import { useSelector } from 'react-redux';

function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="profile-container">
        <h1>Profile Page</h1>
        <div className="profile-details">
            <table className="profile-table">
                <thead>
                    <tr>
                        <th colSpan="2">
                            <h3>User Information</h3>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Name:</th>
                        <td>{user?.name || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th>Email:</th>
                        <td>
                            {user?.email || 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <button className="btn btn-block">
                                Change Password
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="social-details">
            <div className="social-buttons">
                <button className="btn btn-block">
                    Add Friend
                </button>
                <button className="btn btn-block">
                    Remove Friend
                </button>
            </div>
            <table className="profile-table">
                <thead>
                    <tr>
                        <th colSpan="2">
                            <h3>Your Friends</h3>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Friend 1:</th>
                        <td>Jane Smith</td>
                    </tr>
                    <tr>
                        <th>Friend 2:</th>
                        <td>Bob Johnson</td>
                    </tr>
                    <tr>
                        <th>Friend 3:</th>
                        <td>Alice Williams</td>
                    </tr>
                </tbody>
            </table>     
        </div>
    </div>
  )
}

export default Profile
