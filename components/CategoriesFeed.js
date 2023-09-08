import { useAtom } from 'jotai';
import { categoriesAtom } from './atoms';

export default function CategoriesFeed({ categories,cChanger }) {
  return categories ? categories.map((category) => <CategoryBar category={category} key={category} cChanger={cChanger} />) : null;
}

function CategoryBar({ category,cChanger }) {
  const [,updateCategoryAtom] = useAtom(categoriesAtom);

  function changeCat(){
    cChanger(category)
    updateCategoryAtom(category.toLowerCase());
  }
  
  return (
    <div >
      <button className='categoryFilterButton' onClick={() => changeCat()}>{category}</button>
    </div>
  );
}