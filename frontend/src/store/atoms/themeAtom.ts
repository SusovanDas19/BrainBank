import { atom } from 'recoil';

export const themeState = atom({
  key: 'themeState',
  default: 'light', // Default to light mode
});
