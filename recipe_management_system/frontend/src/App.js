import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Recipes from './pages/Recipes.jsx';
import Groceries from './pages/Groceries.jsx';

function App() {
  return (
    <Router>
      <div className='container'>
        <Header />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/recipes' element={<Recipes />} />
          <Route path='/groceries' element={<Groceries />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
