import React, { useContext } from 'react';

import '../styles/Controler.styles.scss';

import StatusSelector from './StatusSelector';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToDoContext } from '../contexts/ToDoContext';
import { deleteToDo } from '../services/todo_api';

const Controler: React.FC = () => {
  const { darkTheme } = useContext(ThemeContext);
  const { toDoList, setToDoList, filteredToDoList, activeList } =
    useContext(ToDoContext);

  const deleteCompetedToDos = async () => {
    const completedList = toDoList.filter((item) => item.isCompleted);

    try {
      // Delete all completed ToDos from the database and the state
      const deleteOperations = completedList.map(async (item) => {
        try {
          // Delete from the database
          await deleteToDo(item._id);
          return item;
        } catch (error) {
          console.error(error);
          throw error;
        }
      });

      // Wait for all deletes to be completed
      const deletedItems = await Promise.all(deleteOperations);

      // Update the state after all deletions are successful
      const newList = toDoList.filter((item) => !deletedItems.includes(item));
      setToDoList(newList);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div
        className={`
          controler
          card
          ${darkTheme ? 'dark-theme' : ''}
          ${filteredToDoList.length < 1 ? 'round-border-top' : ''}
        `}
      >
        <p>{activeList.length} items left</p>
        <StatusSelector additionalClassName='desktop' />
        <button onClick={deleteCompetedToDos}>Delete Completed</button>
      </div>
      <StatusSelector additionalClassName='mobile' />
    </div>
  );
};

export default Controler;
