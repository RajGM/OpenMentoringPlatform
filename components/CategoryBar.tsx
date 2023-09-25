import React, { useState, useEffect } from "react";
import CategoriesFeed from "@components/CategoriesFeed";
import { CategoriesType } from "@lib/types";

let categories: CategoriesType = [
  "Hackathon",
  "Grants",
  "Conferences",
  "Internship",
];
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
  const [stateC, setCState] = useState<string>("Hackathon");

  return (
    <div className="middle" style={{ marginTop: "10px" }}>
      <div className="childDiv">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignSelf: "center",
            alignItems: "center",
            gap: "20px",
            border: "2px solid black",
            boxShadow: "5px 5px black",
            padding: "10px",
          }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Categories
            </h1>
          </div>
          <div>
            <CategoriesFeed categories={categories} cChanger={setCState} />
          </div>
        </div>
      </div>

      <div className="childDiv">
        <FilterBar selectedC={stateC} />
      </div>
    </div>
  );
};

export default CategoryBar;
