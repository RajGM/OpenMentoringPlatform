import { atom } from 'jotai';

export const textAtom = atom<string>('hello');

export const incrementAtom = atom<string, void, string>(
  (get) => get(textAtom),
  (get, set, arg: string) => set(textAtom, arg)
);

export const categoriesAtom = atom<string>('hackathon');

export const updateCategoryAtom = atom<string, void, string>(
  (get) => get(categoriesAtom),
  (get, set, arg: string) => set(categoriesAtom, arg)
);

export const filterAtom = atom<string>('all');

export const updateFilterAtom = atom<string, void, string>(
  (get) => get(filterAtom),
  (get, set, arg: string) => set(filterAtom, arg)
);
