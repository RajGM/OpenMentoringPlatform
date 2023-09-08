import { useState,useEffect } from 'react';
import CategoriesFeed from "@components/CategoriesFeed";
//"OpenSource"
let categories = ["Hackathon", "Grants", "Conferences", "Internship"];
import FilterBar from "@components/FilterBar";

//CategoryBar
export default function CategoryBar() {
  const [stateC, setCState] = useState('Hackathon');

  return (
    <div className='middle' >
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
