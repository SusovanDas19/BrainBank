import { atom } from "recoil";


export type DashboardTab = "all" | "Admins" | "Members" | "Home" | "add";

export const dashboardTabAtom = atom<DashboardTab>({
  key: "dashboardTab",
  default: "Home",
});

export const dashboardActiveAtom = atom({
  key: "dashboardActiveAtom",
  default: false
})

