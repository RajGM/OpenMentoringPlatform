import React, { useContext } from 'react';
import { UserContext } from '@lib/context';
import Loader from "@components/Loader";
import FilterFeed from "@components/FilterFeed";
import { FilterBarProps } from '@lib/types';

const FilterBar: React.FC<FilterBarProps> = ({ selectedC }) => {
  const { username } = useContext(UserContext);

  return (
    <nav className="categoryBar">
      <ul>
        <li>
          <div className="btn-logo" style={{ width: '180px', textAlign: 'center' }}>Filters</div>
        </li>

        <li>
          <div className='space'></div>
        </li>

        {/* categories are fetched */}
        <FilterFeed selectedCategory={selectedC} />

      </ul>
    </nav>
  );
}

export default FilterBar;
