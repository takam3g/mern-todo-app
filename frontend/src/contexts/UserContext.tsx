import React, { createContext, useState, useEffect } from 'react';

import { User as UserModel } from '../models/user';
import { isUserSignedIn } from '../services/user_api';

type UserContextType = {
  user: UserModel | null;
  setUser: React.Dispatch<React.SetStateAction<UserModel | null>>;
  userLoading: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  userLoading: false,
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadToDos() {
      try {
        setUserLoading(true);
        const user = await isUserSignedIn();
        setUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setUserLoading(false);
      }
    }
    loadToDos();
  }, []);

  const value = { user, setUser, userLoading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
