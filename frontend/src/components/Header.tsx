import React, { useContext } from 'react';

import '../styles/Header.styles.scss';
import moon from '../assets/icon-moon.png';
import sun from '../assets/icon-sun.png';
import { ThemeContext } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  return (
    <header>
      <p>TODO</p>
      <img
        src={darkTheme ? sun : moon}
        className='theme-toggle'
        alt='Theme toggle'
        onClick={() => setDarkTheme(!darkTheme)}
      />
    </header>
  );
};

export default Header;
