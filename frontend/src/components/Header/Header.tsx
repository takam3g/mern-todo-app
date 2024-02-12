import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import './Header.scss';
import moon from '../../assets/icon-moon.png';
import sun from '../../assets/icon-sun.png';
import signout from '../../assets/icon-signout.png';
import { signOut } from '../../services/user_api';
import { ThemeContext } from '../../contexts/ThemeContext';
import { UserContext } from '../../contexts/UserContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = async () => {
    // Sign out
    await signOut();
    // Clear the user state
    setUser(null);
    // Redirect to the todo page
    navigate('/');
  };

  return (
    <header>
      <h1>TODO</h1>
      <div className='nav-container'>
        <p>Hi {user?.username}!</p>
        <nav>
          <img
            src={darkTheme ? sun : moon}
            className='theme-toggle'
            alt='Theme toggle'
            onClick={() => setDarkTheme(!darkTheme)}
          />
          <img
            src={signout}
            className='sign-out'
            alt='sign out'
            onClick={handleSignOut}
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;
