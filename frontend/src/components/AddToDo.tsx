import React, { useContext, useState } from 'react';

import '../styles/AddToDo.styles.scss';
import check from '../assets/icon-check.svg';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToDoContext } from '../contexts/ToDoContext';
import { ToDoInput as ToDoInputModel, createToDo } from '../services/todo_api';

const AddToDo: React.FC = () => {
  const { darkTheme } = useContext(ThemeContext);
  const { toDoList, setToDoList } = useContext(ToDoContext);
  const [toDoInput, setToDoInput] = useState<string>('');

  const handleEnterKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' && toDoInput !== '') {
      const newToDo: ToDoInputModel = {
        text: toDoInput,
        isCompleted: false,
      };

      try {
        // Save to the database
        const toDoSaved = await createToDo(newToDo);
        // Save to the state
        setToDoList([...toDoList, toDoSaved]);
        // Clear the input
        setToDoInput('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div
      className={`
        add-todo 
        card 
        ${darkTheme ? 'dark-theme' : ''}
      `}
    >
      <img src={check} alt='check button' className='check' />
      <input
        className={darkTheme ? 'dark-theme' : ''}
        type='text'
        placeholder='Create a new todo...'
        value={toDoInput}
        onChange={(e) => setToDoInput(e.target.value)}
        onKeyDown={handleEnterKeyDown}
      />
    </div>
  );
};

export default AddToDo;
