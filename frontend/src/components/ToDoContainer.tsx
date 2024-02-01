import React, { useContext, useState } from 'react';

import ToDoCard from './ToDoCard';
import Controler from './Controler';
import { ToDoContext } from '../contexts/ToDoContext';

const ToDoContainer: React.FC = () => {
  const { toDoList, setToDoList, filteredToDoList } = useContext(ToDoContext);

  // Drag and Drop
  const [dragItem, setDragItem] = useState<number | undefined>(undefined);
  const [dragOverItem, setDragOverItem] = useState<number | undefined>(
    undefined
  );

  const handleDragStart = (index: number) => {
    setDragItem(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverItem(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    if (dragItem === undefined || dragOverItem === undefined) {
      return;
    }
    const newList = [...toDoList];
    const temp = newList[dragItem];
    newList[dragItem] = newList[dragOverItem];
    newList[dragOverItem] = temp;
    setToDoList(newList);
    setDragItem(undefined);
    setDragOverItem(undefined);
  };

  return (
    <div className='todo-container'>
      <div className='todo-list'>
        {filteredToDoList.map((item, index) => (
          <ToDoCard
            key={index}
            item={item}
            index={index}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
      <Controler />
    </div>
  );
};

export default ToDoContainer;
