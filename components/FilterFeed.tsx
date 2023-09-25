import React from "react";
import { useAtom } from "jotai";
import { filterAtom } from "@lib/atoms";

import {
  categoriesAndFilters,
  FilterFeedProps,
  FilterBarProps,
} from "@lib/types"; // adjust the path as necessary

const FilterFeed: React.FC<FilterFeedProps> = ({ selectedCategory }) => {
  const filters = categoriesAndFilters[selectedCategory];

  return filters
    ? filters.map((filter) => <FilterBar filter={filter} key={filter} />)
    : null;
};

const FilterBar: React.FC<FilterBarProps> = ({ filter }) => {
  const [, updateFilterAtom] = useAtom(filterAtom);

  function testFun() {
    updateFilterAtom(filter?filter.toLowerCase():"all");
  }

  return (
    <button
      className="group relative inline-block focus:outline-none focus:ring"
      style={{ margin: "10px" }}
      onClick={() => testFun()}
    >
      <span className="absolute inset-0 translate-x-0 translate-y-0 bg-yellow-300 transition-transform group-hover:translate-y-1.5 group-hover:translate-x-1.5"></span>

      <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest">
        {filter}
      </span>
    </button>
  );
};

export default FilterFeed;
