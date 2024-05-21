import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SelectOptions from './components/SelectOptions';
import OneLakhChit from './components/1LakhChit';
import TwoLakhChit from './components/2LakhChit';
import FiveLakhChit from './components/5LakhChit';
import TenLakhChit from './components/10LakhChit';
import ExistingChitPage from './pages/ExistingChitPage';
import NewChitPage from './pages/dashboard/NewChitPage';
// import TwoNewChitPage from './pages/dashboard/TwoNewChitPage';
import FiveNewChitPage from './pages/dashboard/FiveNewChitPage';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Dashboard from './pages/dashboard/dashboard';
import DashboardHome from './pages/dashboard/dashboardHome';
import Contacts from './pages/dashboard/Contacts';
import Settings from './pages/Settings';
import AddContact from './pages/dashboard/AddContact';
import './App.css';

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

            <Route path="contacts" element={<Contacts />} />
            <Route path="settings" element={<Settings />} />
            <Route path="dashboardHome/1lakh" element={<OneLakhChit />} />
            <Route path="dashboardHome/1lakh/NewChitpage" element={<NewChitPage />} />
            <Route path="dashboardHome/2lakh" element={<TwoLakhChit />} />
            {/* <Route path="dashboardHome/2lakh/TwoNewChitPage" element={<TwoNewChitPage />} /> */}
            <Route path="dashboardHome/5lakh" element={<FiveLakhChit />} />
            <Route path="dashboardHome/10lakh" element={<TenLakhChit />} />
            <Route path='dashboardHome/5lakh/FiveNewChitPage' element={<FiveNewChitPage />}/>
          </Route>

          <Route path="/select-options" element={<SelectOptions />} />
          <Route path="/1lakh" element={<OneLakhChit />} />
          <Route path="/2lakh" element={<TwoLakhChit />} />
          <Route path="/5lakh" element={<FiveLakhChit />} />
          <Route path="/existingchit" element={<ExistingChitPage />} />
          <Route path="/newchit" element={<NewChitPage />} />
          <Route path="/10lakh" element={<TenLakhChit />} />
          {/* <Route path="/TwoNewChitPage" element={<TwoNewChitPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
