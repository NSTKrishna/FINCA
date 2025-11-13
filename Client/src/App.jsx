import React from 'react';
import Signup  from './pages/signup'; 
import Login  from './pages/login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App;