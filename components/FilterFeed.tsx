import React from 'react';
import { useAtom } from 'jotai';
import { filterAtom } from './atoms';

const categoriesAndFilters: Record<string, string[]> = {
  "Hackathon": ["Onsite", "Remote", "Hybrid", "All"],
  "Internship": ["Onsite", "Remote", "Hybrid"],
  "Grants": ["Travel", "Course", "Conference"],
  "Conferences": ["Design", "Launch Event"]
}

interface FilterFeedProps {
  selectedCategory: string;
}

const FilterFeed: React.FC<FilterFeedProps> = ({ selectedCategory }) => {
  const filters = categoriesAndFilters[selectedCategory];

  return filters ? filters.map((filter) => <FilterBar filter={filter} key={filter} />) : null;
}

interface FilterBarProps {
  filter: string;
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
