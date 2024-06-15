import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SelectOptions from './components/SelectOptions';

import NewChitPage from './pages/dashboard/NewChitPage';
// import TwoNewChitPage from './pages/dashboard/TwoNewChitPage';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Dashboard from './pages/dashboard/dashboard';
import DashboardHome from './pages/dashboard/dashboardHome';
import Contacts from './pages/dashboard/Contacts';
import Settings from './pages/Settings';
import AddContact from './pages/dashboard/AddContact';
import ExistingChits from './pages/dashboard/ExistingChits';
import './App.css';
import GroupDetails from './pages/dashboard/GroupDetails';
import ChitFundDetails from './pages/dashboard/ChitfundsDetails';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<AuthPage />} />
          
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="dashboardHome" element={<DashboardHome />} />
            <Route path="dashboardHome/addContact" element={<AddContact />} />
            <Route path="dashboardHome/addContact" element={<AddContact />} />
            <Route path="dashboardHome/chitdetails" element={<ChitFundDetails chitfundId="N9E8N4iDHMeURbo8culf" />} />

            <Route path="contacts" element={<Contacts />} />
            <Route path="settings" element={<Settings />} />
            {/* <Route path="dashboardHome/1lakh" element={<OneLakhChit />} /> */}
            <Route path="dashboardHome/NewChitpage" element={<NewChitPage />} />
            <Route path="dashboardHome/existingChits" element={<ExistingChits />} />
            <Route path="dashboardHome/existingChits/:groupId" element={<GroupDetails />} />

          </Route>

        
          {/* <Route path="/TwoNewChitPage" element={<TwoNewChitPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
