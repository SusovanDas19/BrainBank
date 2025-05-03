import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ResponseStr } from "./Youtube";




export const ShareBrain = () => {
  const { hash } = useParams<{ hash: string }>();
  const [alldata, setAllData] = useState<ResponseStr[]>([]);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await axios.get(
          `http://localhost:3000/v1/share/brain/show/${hash}`
        );

        if(response.status === 200){
            setAllData(response.data.user)
            console.log(response.data.user)
        }
      } catch (e) {}
    }

    fetch();
  },[hash]);

  return <div>
    
share brain
  </div>;
};
