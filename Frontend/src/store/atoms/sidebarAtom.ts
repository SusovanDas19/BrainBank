import { atom } from "recoil";

export const sidebarAtom = atom({
    key: "sidebarAtom",
    default: false
})

export const searchActiveAtom = atom({
    key: "searchActiveAtom",
    default: false
})

export const othersTabActiveAtom = atom({
    key: "othersTabActiveAtom",
    default: false
})