import React from "react";
import { useAtom } from "jotai";
import { categoriesAtom } from "@lib/atoms";
import { CategoriesFeedProps, CategoryBarProps } from "@lib/types";

const CategoriesFeed: React.FC<CategoriesFeedProps> = ({
  categories,
  cChanger,
}) => {
  return categories
    ? categories.map((category) => (
        <CategoryBar category={category} key={category} cChanger={cChanger} />
      ))
    : null;
};

const CategoryBar: React.FC<CategoryBarProps> = ({ category, cChanger }) => {
  const [, updateCategoryAtom] = useAtom(categoriesAtom);

  function changeCat() {
    cChanger(category);
    updateCategoryAtom(category.toLowerCase());
  }

  return (
    <button
      className="group relative inline-block text-sm font-medium text-red-600 focus:outline-none focus:ring active:text-red-500" style={{margin:'10px'}}
      onClick={() => changeCat()}
    >
      <span className="absolute inset-0 border border-current"></span>
      <span className="block border border-current bg-white px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
        {category}
      </span>
    </button>
  );
};

export default CategoriesFeed;
