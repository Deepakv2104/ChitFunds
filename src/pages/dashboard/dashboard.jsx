import React from 'react'
import { Outlet } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Sidebar from './Sidebar';
import './styles/dashboard.css'
const Dashboard = () => {
  return (
    <div className='dashboard'>
    <Layout>
   

      <Outlet />
    </Layout>
  </div>
  )
}

export default Dashboard;