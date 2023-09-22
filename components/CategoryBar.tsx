import React, { useState, useEffect } from 'react';
import CategoriesFeed from "@components/CategoriesFeed";

let categories: string[] = ["Hackathon", "Grants", "Conferences", "Internship"];
import FilterBar from "@components/FilterBar";

interface CategoriesFeedProps {
  categories: string[];
  cChanger: (category: string) => void;
}

interface FilterBarProps {
  selectedC: string;
}

//CategoryBar
const CategoryBar: React.FC = () => {
  const [stateC, setCState] = useState<string>('Hackathon');

  return (
    <div className='middle'>
      <div className='childDiv'>
        <nav className="categoryBar">
          <ul>
            <li className='btn-logo'>
              <div className="btn-logo">Categories</div>
            </li>

            <li>
              <div className='space'></div>
            </li>

            {/* categories are fetched */}
            <CategoriesFeed categories={categories} cChanger={setCState} />

          </ul>
        </nav>
      </div>

      <div className='childDiv'>
        <FilterBar selectedC={stateC} />
      </div>

    </div>
  );
}

export default CategoryBar;
