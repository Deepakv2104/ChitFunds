import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SelectOptions from './components/SelectOptions';
import OneLakhChit from './components/1LakhChit';
import TwoLakhChit from './components/2LakhChit';
import FiveLakhChit from './components/5LakhChit';
import TenLakhChit from './components/10LakhChit';
import ExistingChitPage from './pages/ExistingChitPage';
import NewChitPage from './pages/NewChitPage';
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'
// Import other chit pages here
import './App.css'
const App = () => {
  return (

    <Router>
       <div className="App">
     
      <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/signup" exact element={<AuthPage />} />
      <Route path="/select-options" element={<SelectOptions />} />
      <Route path="/1lakh" element={<OneLakhChit />} />
      <Route path="/2lakh" element={<TwoLakhChit />} />
      <Route path="/5lakh" element={<FiveLakhChit />} />
      <Route path="/existingchit" element={<ExistingChitPage />} />
        <Route path="/newchit" element={<NewChitPage />} />
      <Route path="/10lakh" element={<TenLakhChit />} />
      {/* Add routes for other chit pages */}
      </Routes>
   
      </div>
      
    </Router>
  );
};

export default App;
