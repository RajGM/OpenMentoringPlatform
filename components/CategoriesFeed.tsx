import React from 'react';
import { useAtom } from 'jotai';
import { categoriesAtom } from '@lib/atoms';

interface CategoriesFeedProps {
  categories: string[];
  cChanger: (category: string) => void;
}

const CategoriesFeed: React.FC<CategoriesFeedProps> = ({ categories, cChanger }) => {
  return categories ? categories.map((category) => <CategoryBar category={category} key={category} cChanger={cChanger} />) : null;
}

interface CategoryBarProps {
  category: string;
  cChanger: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ category, cChanger }) => {
  const [, updateCategoryAtom] = useAtom(categoriesAtom);

  function changeCat() {
    cChanger(category);
    updateCategoryAtom(category.toLowerCase());
  }

  return (
    <div>
      <button className='categoryFilterButton' onClick={() => changeCat()}>{category}</button>
    </div>
  );
}

export default CategoriesFeed;
