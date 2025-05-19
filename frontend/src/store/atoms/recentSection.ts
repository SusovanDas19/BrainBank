import { atom } from "recoil";
import { ResponseStr } from "../../Components/Tabs/Youtube";



export const recentSectionPosts = atom<ResponseStr[]>({
    key: "recentSectionPosts",
    default: []
})