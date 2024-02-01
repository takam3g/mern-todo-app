import React, { useContext } from 'react';

import '../styles/StatusSelector.styles.scss';
import Button from './Button';
import { ThemeContext } from '../contexts/ThemeContext';
import { ToDoContext, LIST_VIEW } from '../contexts/ToDoContext';

interface StatusSelectorProps {
  additionalClassName?: string;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  additionalClassName,
}) => {
  const { darkTheme } = useContext(ThemeContext);
  const { listView, setListView } = useContext(ToDoContext);

  const getVisibleStatusClassName = (status: LIST_VIEW) => {
    return listView === status ? 'visibleListStatus' : '';
  };

  return (
    <div
      className={`
        status-selector
        card
        ${additionalClassName}
        ${darkTheme ? 'dark-theme' : ''}
      `}
    >
      {Object.values(LIST_VIEW).map((status) => (
        <Button
          key={status}
          onClickHandler={() => setListView(status)}
          className={getVisibleStatusClassName(status)}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ))}
    </div>
  );
};

export default StatusSelector;
