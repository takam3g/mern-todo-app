import React, { createContext, useState, useEffect, useContext } from 'react';

import { ToDo as ToDoModel } from '../models/todo';
import { fetchToDos } from '../services/todo_api';
import { UserContext } from '../contexts/UserContext';

export enum LIST_VIEW {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

interface ToDoContextType {
  toDoList: ToDoModel[];
  setToDoList: React.Dispatch<React.SetStateAction<ToDoModel[]>>;
  listView: LIST_VIEW;
  setListView: React.Dispatch<React.SetStateAction<LIST_VIEW>>;
  filteredToDoList: ToDoModel[];
  setFilteredToDoList: React.Dispatch<React.SetStateAction<ToDoModel[]>>;
  activeList: ToDoModel[];
  setActiveList: React.Dispatch<React.SetStateAction<ToDoModel[]>>;
  toDosLoading: boolean;
}

export const ToDoContext = createContext<ToDoContextType>({
  toDoList: [],
  setToDoList: () => {},
  listView: LIST_VIEW.ALL,
  setListView: () => {},
  filteredToDoList: [],
  setFilteredToDoList: () => {},
  activeList: [],
  setActiveList: () => {},
  toDosLoading: false,
});

interface ToDoProviderProps {
  children: React.ReactNode;
}

export const ToDoProvider: React.FC<ToDoProviderProps> = ({ children }) => {
  const { user } = useContext(UserContext);

  const [toDoList, setToDoList] = useState<ToDoModel[]>([]);
  const [activeList, setActiveList] = useState<ToDoModel[]>(toDoList);
  const [filteredToDoList, setFilteredToDoList] =
    useState<ToDoModel[]>(toDoList);
  const [listView, setListView] = useState<LIST_VIEW>(LIST_VIEW.ALL);
  const [toDosLoading, setToDosLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadToDos() {
      try {
        setToDosLoading(true);
        const todos = await fetchToDos();
        setToDoList(todos);
      } catch (error) {
        console.error(error);
      } finally {
        setToDosLoading(false);
      }
    }
    loadToDos();
  }, [user]);

  useEffect(() => {
    setActiveList(toDoList.filter((item) => !item.isCompleted));
  }, [toDoList]);

  useEffect(() => {
    switch (listView) {
      case LIST_VIEW.ACTIVE:
        setFilteredToDoList(toDoList.filter((item) => !item.isCompleted));
        break;
      case LIST_VIEW.COMPLETED:
        setFilteredToDoList(toDoList.filter((item) => item.isCompleted));
        break;
      default:
        setFilteredToDoList(toDoList);
    }
  }, [listView, toDoList]);

  const value: ToDoContextType = {
    toDoList,
    setToDoList,
    listView,
    setListView,
    filteredToDoList,
    setFilteredToDoList,
    activeList,
    setActiveList,
    toDosLoading,
  };

  return <ToDoContext.Provider value={value}>{children}</ToDoContext.Provider>;
};
