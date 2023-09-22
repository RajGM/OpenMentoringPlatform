import React from 'react';

interface LoaderProps {
  show: boolean;
  className?: string;  // Added className property
}

const Loader: React.FC<LoaderProps> = ({ show, className }) => {
  return show ? <div className={`loader ${className}`}></div> : null;
}

export default Loader;
