import React, { useContext } from "react";
import { UserContext } from "@lib/context";
import Loader from "@components/Loader";
import FilterFeed from "@components/FilterFeed";
import { FilterBarProps } from "@lib/types";

const FilterBar: React.FC<FilterBarProps> = ({ selectedC }) => {
  const { username } = useContext(UserContext);

  return (
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
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Filter</h1>
      </div>
      <div>
        <FilterFeed selectedCategory={selectedC} />
      </div>
    </div>
  );
};

export default FilterBar;
