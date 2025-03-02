import { atom } from "recoil";

export const showFormState = atom<boolean>({
  key: "showFormState",
  default: false,
});

export const selectOpt = atom({
  key: "selectOpt",
  default: ""
})