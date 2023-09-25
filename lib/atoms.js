import { atom } from 'jotai';

export const textAtom = atom('hello');

export const incrementAtom = atom(
  (get) => get(textAtom),
  (get, set, arg) => set(textAtom, arg)
);

export const categoriesAtom = atom('hackathon');

export const updateCategoryAtom = atom(
  (get) => get(categoriesAtom),
  (get, set, arg) => set(categoriesAtom, arg)
);

export const filterAtom = atom('all');

export const updateFilterAtom = atom(
  (get) => get(filterAtom),
  (get, set, arg) => set(filterAtom, arg)
);
