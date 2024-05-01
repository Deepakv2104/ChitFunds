import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { getAuth, signOut } from 'firebase/auth';
import { firebase } from '../Authentication/firebase';




const Settings = () => {
    const auth = getAuth(firebase);
    const navigate = useNavigate();
    const handleLogout = async () => {

        try {
          await signOut(auth);
          navigate('/');
          // Redirect or perform any other action after logout
        } catch (error) {
          console.error('Error logging out:', error.message);
        }
      };
  return (
    <div>
      <h1>Settings</h1>
      <Button type="primary" danger onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Button>
    </div>
  );
};

export default Settings;
