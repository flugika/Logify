import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import AdminHome from './components/AdminHome';
import User from './components/User/User';
import LogDetail from './components/Log/LogDetail';
import LogCreate from './components/Log/LogCreate';
import MusicCreate from './components/Music/MusicCreate';
import MusicDetail from './components/Music/MusicDetail';
import LogLiked from './components/Log/LogLiked';
import MyLog from './components/Log/MyLog';
import LogSaved from './components/Log/LogSaved';
import Follower from "./components/User/Follower";
import Following from "./components/User/Following";
import Profile from "./components/User/Profile";
import EditProfile from "./components/User/EditProfile";

function App() {
  const [token, setToken] = useState('');
  const [role, setRole] = useState<string | null>(null);

  const isTokenExpired = (token: string) => {
    try {
      // Split the JWT to access the payload (second part of the JWT)
      const payloadBase64 = token.split('.')[1];

      // Decode the payload from Base64
      const payload = JSON.parse(atob(payloadBase64));

      // Get the current time in seconds
      const currentTime = Date.now() / 1000;

      // Return true if the token has expired, otherwise false
      return payload.exp < currentTime;
    } catch (error) {
      // Return true if decoding fails or token is invalid
      return true;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        // Token is expired, remove it and navigate to sign-in
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/signin';
      } else {
        setToken(storedToken);
        setRole(storedRole);
      }
    }
  }, []);


  // Component to protect routes based on authentication
  const ProtectedRoute = ({ adminElement, userElement }: { adminElement: JSX.Element, userElement: JSX.Element }) => {
    const location = useLocation();
    const isSignupPage = location.pathname === '/signup';

    if (!token && !isSignupPage) {
      return <SignIn />;
    }

    // If the role is 'Admin', show the adminElement, otherwise show userElement
    if (role === 'Admin') {
      return adminElement;
    } else if (role === 'User') {
      return userElement;
    }

    // Default return if no valid role found (could redirect to sign-in or other)
    return <SignIn />;
  };

  return (
    <Router>
      <div className="App-body">
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={<ProtectedRoute adminElement={<AdminHome />} userElement={<User />} />}
          >
            {/* Nested Routes for User */}
            <Route path="home" element={<Home />} />
            <Route path="log/:id" element={<LogDetail />} />
            <Route path="log/create" element={<LogCreate />} />
            <Route path="log/my" element={<MyLog />} />
            <Route path="log/liked" element={<LogLiked />} />
            <Route path="log/saved" element={<LogSaved />} />
            <Route path="music" element={<MusicDetail />} />
            <Route path="music/create" element={<MusicCreate />} />
            <Route path="follower" element={<Follower />} />
            <Route path="following" element={<Following />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to={token ? '/' : '/signin'} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
