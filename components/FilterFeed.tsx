import React from 'react';
import { useAtom } from 'jotai';
import { filterAtom } from '@lib/atoms';

import { 
  categoriesAndFilters, 
  FilterFeedProps, 
  FilterBarProps 
} from '@lib/types';  // adjust the path as necessary

const FilterFeed: React.FC<FilterFeedProps> = ({ selectedCategory }) => {
  const filters = categoriesAndFilters[selectedCategory];

  return filters ? filters.map((filter) => <FilterBar filter={filter} key={filter} />) : null;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter }) => {
  const [, updateFilterAtom] = useAtom(filterAtom);

  function testFun() {
    updateFilterAtom(filter.toLowerCase());
  }

  return (
    <div>
      <button className="categoryFilterButton" onClick={testFun}>{filter}</button>
    </div>
  );
}

export default FilterFeed;
