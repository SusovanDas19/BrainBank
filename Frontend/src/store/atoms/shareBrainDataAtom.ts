import { atom } from "recoil";
import { ResponseStr } from "../../Components/Tabs/Youtube";


export const ShareBrainDataAtom = atom<ResponseStr[]>({
    key: "ShareBrainDataAtom",
    default: []
})

export const ShareBrainUsernameAtom = atom({
    key: "ShareBrainUsername",
    default: ""
})

export const ShareBrainTypeAtom = atom({
    key: "ShareBrainTypeAtom",
    default: ""
})