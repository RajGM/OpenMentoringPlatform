import React from 'react';

import { LoaderProps } from '@lib/types';

const Loader: React.FC<LoaderProps> = ({ show, className }) => {
  return show ? <div data-testid="loader-div" className={`loader ${className}`}></div> : null;
}

export default Loader;
