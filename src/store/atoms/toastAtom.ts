import { atom } from "recoil";
import { ToastProps } from "../../Components/UI/Toast";


export const allToasts = atom<ToastProps[]>({
    key: "toastState",
    default: [],
})