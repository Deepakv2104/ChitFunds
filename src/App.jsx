import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SelectOptions from './components/SelectOptions';

import NewChitPage from './pages/dashboard/newChit/NewChitPage';
// import TwoNewChitPage from './pages/dashboard/TwoNewChitPage';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Dashboard from './pages/dashboard/dashboard';
import DashboardHome from './pages/dashboard/dashboardHome';
import Contacts from './pages/dashboard/Contacts';
import Settings from './pages/Settings';
import AddContact from './pages/dashboard/addContact/AddContact';
import ExistingChits from './pages/dashboard/ExistingChits';
import './App.css';
import GroupDetails from './pages/dashboard/GroupDetails';
import ChitFundDetails from './pages/dashboard/ChitfundsDetails';
import Testing from './pages/dashboard/Testing'
import Login from './pages/Login'



const App = () => {
  return (
    <Router>

      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/settings" element={<Settings />} />


          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="dashboardHome" element={<DashboardHome />} />
            <Route path="dashboardHome/addContact" element={<AddContact />} />
            <Route path="dashboardHome/addContact/existingChits/:groupId" element={<ChitFundDetails />} />
            <Route path="dashboardHome/NewChitpage/:chitAmount" element={<NewChitPage />} />
            <Route path="dashboardHome/existingChits" element={<ExistingChits />} />
            <Route path="dashboardHome/existingChits/:groupId" element={<ChitFundDetails />} />

          </Route>


        </Routes>
      </div>
    </Router>
  );
};

export default App;