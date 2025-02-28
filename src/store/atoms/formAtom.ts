import { atom } from "recoil";

export const showFormState = atom<boolean>({
  key: "showFormState",
  default: false,
});