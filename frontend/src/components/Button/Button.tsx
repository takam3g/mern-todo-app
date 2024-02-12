import React from 'react';

interface ButtonProps {
  text: string;
  onClickHandler: () => void;
  className: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClickHandler, className }) => {
  return (
    <button key={text} onClick={onClickHandler} className={className}>
      {text}
    </button>
  );
};

export default Button;
