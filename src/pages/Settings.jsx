import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Space, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { getAuth, signOut } from 'firebase/auth';
import { firebase } from '../Authentication/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './Settings.css'; // Custom CSS for additional styling

const { Title, Text } = Typography;

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const auth = getAuth(firebase);
  const navigate = useNavigate();
  const db = getFirestore(firebase);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.error('No such user document!');
          }
        } else {
          console.error('No user is signed in!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        message.error('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [auth, db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      message.success('Logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error.message);
      message.error('Error logging out.');
    }
  };

  return (
    <div className="settings-container">
      <Card className="settings-card">
        {userData && (
          <div className="user-info-card">
            <Title level={3}>Profile</Title>
            <Space direction="vertical" size="middle">
              <Text><strong>Name:</strong> {userData.name}</Text>
              <Text><strong>Email:</strong> {userData.email}</Text>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  danger 
                  onClick={handleLogout} 
                  icon={<LogoutOutlined />} 
                  block
                  style={{ marginTop: '20px' }}
                  className="logout-button"
                >
                  Logout
                </Button>
              </Space>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Settings;
