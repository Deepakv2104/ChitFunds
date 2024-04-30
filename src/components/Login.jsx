import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === 'admin' && password === 'password') {
            navigate('/select-options');
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div className="login">
          <div className="login-screen">
            <div className="login-form">
              <h2>Login</h2>
              <div className="form-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="form-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <button className="login-button" onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      );
    };
    
    export default Login;
