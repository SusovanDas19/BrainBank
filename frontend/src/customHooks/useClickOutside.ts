import { RefObject, useEffect } from "react";


const useClickOutside = (ref: RefObject<HTMLElement>, onClickOutside: () => void)=>{
    useEffect(()=>{
        const handleClcikOutside = (event: MouseEvent)=>{
            if(ref.current && !ref.current.contains(event.target as Node)){
                onClickOutside();
            }
        }

        document.addEventListener("mousedown", handleClcikOutside)
        return ()=> document.removeEventListener("mousedown", handleClcikOutside)
    },[ref, onClickOutside])
}

export default useClickOutside;