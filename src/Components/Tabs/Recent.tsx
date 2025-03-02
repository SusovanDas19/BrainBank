// import { Header } from "../Header"

import {useSetRecoilState } from "recoil"
import { currSidebar } from "../../store/atoms/currSideTab"
import { useEffect } from "react"
import { selectOpt } from "../../store/atoms/formAtom"

export const Recent = ()=>{
    const setCurrtab = useSetRecoilState(currSidebar)
    const setSelectedOption = useSetRecoilState(selectOpt);

    useEffect(()=>{
        setCurrtab("Recent");
        setSelectedOption("");
    })
    return(
        <div className="h-screen flex justify-center items-center text-black dark:text-white bg-white dark:bg-primaryBlack"> 
            Recent section
        </div>
    )
}