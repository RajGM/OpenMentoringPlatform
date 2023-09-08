import { useAtom } from 'jotai';
import { filterAtom } from './atoms';

const categoriesAndFilters = {
  "Hackathon": ["Onsite", "Remote", "Hybrid","All"],
  "Internship": ["Onsite", "Remote", "Hybrid"],
  "Grants": ["Travel", "Course", "Conference"],
  "Conferences": [ "Design","Launch Event"]
}

export default function FilterFeed({ selectedCategory }) {
  const filters = categoriesAndFilters[selectedCategory];
  const sc = selectedCategory;

  return filters ? filters.map((filter) => <FilterBar filter={filter} key={filter} />) : null;
}

function FilterBar({ filter }) {
  const [, updateFilterAtom] = useAtom(filterAtom);

  function testFun() {
    updateFilterAtom(filter.toLowerCase());
  }

  return (
    <div >
      <button className="categoryFilterButton" onClick={testFun} >{filter}</button>
    </div>
  );
}
