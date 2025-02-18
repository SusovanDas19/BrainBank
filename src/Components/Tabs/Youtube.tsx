import { useRecoilState } from "recoil";
import { Header } from "../Header"
import { useState, useEffect } from "react";
import { currSidebar } from "../../store/atoms/currSideTab";
import axios from "axios";

export const Youtube = () => {
    const [currTab, setCurrTab] = useRecoilState(currSidebar);
    const [content, setContent] = useState([]);

    useEffect(() => {
       setCurrTab("Youtube")
        try{
            fetchContent();
            async function fetchContent() {

                const response = await axios.get("http://localhost:3000/v1/content/fetch",{
                    params: {type: `${currTab}`}
                });
                setContent(response.data);
                console.log(response.data);
            }
        }catch(error){
            console.error('Error fetching content:', error);
        }
    }, []);

    return (
        <div className="h-screen bg-white dark:bg-primaryBlack">
            <Header />
            {content.length === 0 ? (
                <p>No content added</p>
            ) : (
                // Render content here
                <div>{content}</div>
            )}
        </div>
    );
}