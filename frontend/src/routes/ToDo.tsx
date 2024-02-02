import React, { useContext } from 'react';

import '../styles/ToDo.styles.scss';
import loading from '../assets/icon-loading.gif';
import { ThemeContext } from '../contexts/ThemeContext';
import Header from '../components/Header';
import AddToDo from '../components/AddToDo';
import ToDoContainer from '../components/ToDoContainer';
import { ToDoContext } from '../contexts/ToDoContext';

const ToDo: React.FC = () => {
  const { darkTheme } = useContext(ThemeContext);
  const { toDoList, toDosLoading } = useContext(ToDoContext);

  return (
    <div
      className={`
        bg-container 
        ${darkTheme ? 'dark-theme' : ''}
      `}
    >
      <div
        className={`
          app-wrapper 
          ${darkTheme ? 'dark-theme' : ''}
        `}
      >
        <Header />
        <AddToDo />
        {toDosLoading ? (
          <img src={loading} alt='loading' className='loading' />
        ) : toDoList.length === 0 ? (
          <p
            className={`
              card
              ${darkTheme ? 'dark-theme' : ''}
            `}
          >
            You don't have any ToDo yet
          </p>
        ) : (
          <>
            <ToDoContainer />
            <p className='bottom-msg'>Drag and drop to reorder list</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ToDo;
