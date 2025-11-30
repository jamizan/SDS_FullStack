import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Recipes from './pages/Recipes.jsx';
import Groceries from './pages/Groceries.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <Router>
      <div className='container'>
        <Header />
        <Routes>
          <Route path='/' element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/recipes' element={
            <PrivateRoute>
              <Recipes />
            </PrivateRoute>
          } />
          <Route path='/groceries' element={
            <PrivateRoute>
              <Groceries />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
