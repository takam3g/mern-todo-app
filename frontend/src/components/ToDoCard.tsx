import React, { useContext, useState } from 'react';

import '../styles/ToDoCard.styles.scss';
import check from '../assets/icon-check.svg';
import cross from '../assets/icon-cross.svg';

import { ThemeContext } from '../contexts/ThemeContext';
import { ToDoContext } from '../contexts/ToDoContext';
import { ToDo as ToDoModel } from '../models/todo';
import {
  deleteToDo,
  updateToDo,
  ToDoInput as ToDoInputModel,
} from '../services/todo_api';

interface ToDoCardProps {
  item: ToDoModel;
  index: number;
  onDragEnd: () => void;
  onDragEnter: (index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (index: number) => void;
}

const ToDoCard: React.FC<ToDoCardProps> = ({
  item,
  index,
  onDragEnd,
  onDragEnter,
  onDragOver,
  onDragStart,
}) => {
  const { darkTheme } = useContext(ThemeContext);
  const { toDoList, setToDoList } = useContext(ToDoContext);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTextInput, setNewTextInput] = useState<string>(item.text);

  const toggleComplete = async () => {
    const newToDo: ToDoInputModel = {
      text: item.text,
      isCompleted: !item.isCompleted,
    };

    try {
      // Update in the database
      const toDoUpdated = await updateToDo(item._id, newToDo);
      // Update in the state
      const newList = [...toDoList];
      const index = newList.indexOf(item);
      newList[index] = toDoUpdated;
      setToDoList(newList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDoubleClick = () => {
    !item.isCompleted && setIsEditing(true);
  };

  const handleEnterKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Update the item if the new text is not blank and different from the old one
    if (
      e.key === 'Enter' &&
      newTextInput !== '' &&
      newTextInput !== item.text
    ) {
      const newToDo: ToDoInputModel = {
        text: newTextInput,
        isCompleted: item.isCompleted,
      };

      try {
        // Update in the database
        const toDoUpdated = await updateToDo(item._id, newToDo);
        // Update in the state
        const newList = [...toDoList];
        const index = newList.indexOf(item);
        newList[index] = toDoUpdated;
        setToDoList(newList);
        // Reset the state to non-editing
        setIsEditing(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteItem = async () => {
    try {
      // Delete from the database
      await deleteToDo(item._id);
      // Delete from the state
      const newList = [...toDoList];
      const index = newList.indexOf(item);
      newList.splice(index, 1);
      setToDoList(newList);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`
        todo 
        card 
        ${index === 0 ? 'round-border-top' : ''}
        ${darkTheme ? 'dark-theme' : ''}
      `}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <img
        src={check}
        alt='complete button'
        className={`
          check 
          ${item.isCompleted ? 'completed' : ''}
        `}
        onClick={toggleComplete}
      />
      {isEditing ? (
        <input
          type='text'
          value={newTextInput}
          onChange={(e) => setNewTextInput(e.target.value)}
          onKeyDown={handleEnterKeyDown}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <p
          className={item.isCompleted ? 'completed' : ''}
          onDoubleClick={handleDoubleClick}
        >
          {item.text}
        </p>
      )}
      <img
        src={cross}
        alt='delete button'
        className='delete'
        onClick={deleteItem}
      />
    </div>
  );
};

export default ToDoCard;
