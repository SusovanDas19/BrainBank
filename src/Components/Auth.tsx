import { useRecoilValue, useSetRecoilState } from "recoil";
import { motion } from "motion/react";
import { InputBox } from "./UI/InputBox";
import { signInUpToggel } from "../store/atoms/signInUpToggel";
import { Button } from "./UI/Button";
import axios from "axios";
import { Tabs } from "./UI/Tabs";

export const Auth = () => {
  const signInUp = useRecoilValue(signInUpToggel);
  return (
    <div className="h-screen bg-white dark:bg-primaryBlack flex justify-center items-center pb-10">
      <div className="h-[500px] w-4xl flex flex-row bg-transparent rounded-xl dark:shadow-[0px_2px_5px_black] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
        {signInUp === "signin" ? <Signin /> : <Signup />}
      </div>
    </div>
  );
};

const Signin = () => {
  const setShowSignInUp = useSetRecoilState(signInUpToggel);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const response = await axios.post("http://localhost:3000/v1/user/signin", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      window.location.href = "/";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "An error occurred. Please try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className=" w-full flex flex-row justify-center items-center">
      <div className=" w-1/2 flex flex-col gap-20 justify-center items-center">
        <h1 className="font-primary text-5xl dark:text-white text-black">Signin</h1>
        <div className="flex flex-col gap-5 justify-center items-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputBox placeholder="Username" type="text" name="username" />
            <InputBox placeholder="Password" type="password" name="password" />
            <Button text="Submit" variant="primary" size="sm" type="submit" />
          </form>
        </div>
      </div>
      <motion.div initial={{ x: -450 }} animate={{ x: 0 }} transition={{ duration: 1, ease: "anticipate" }} className="w-1/2 h-full rounded-r-xl z-100 gap-18 flex flex-col justify-center items-center font-primary bg-whiteOrange dark:bg-blackOrange">
        <h1 className="text-5xl font-medium text-white">Hello, Friend!</h1>
        <p className="text-center text-xl font-medium">Don't have an account then register<br /> and use our services</p>
        <Button text="Signup" variant="secondary" size="sm" onClick={() => setShowSignInUp("signup")} />
      </motion.div>
    </div>
  );
};

const Signup = () => {
  const setShowSignInUp = useSetRecoilState(signInUpToggel);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    try {
      await axios.post("http://localhost:3000/v1/user/signup", data);
      alert("Signup successful. Please sign in.");
      setShowSignInUp("signin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "An error occurred. Please try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <motion.div initial={{ x: 450 }} animate={{ x: 0 }} transition={{ duration: 1, ease: "anticipate" }} className="w-1/2 h-full rounded-l-xl z-100 gap-18 flex flex-col justify-center items-center font-primary bg-whiteOrange dark:bg-blackOrange">
        <h1 className="text-5xl font-medium text-white">Welcome Back!</h1>
        <p className="text-center text-xl font-medium text-gray-900">Already have an account then signin<br /> with credentials and use our services</p>
        <Button text="Signin" variant="secondary" size="sm" onClick={() => setShowSignInUp("signin")} />
      </motion.div>
      <div className="w-1/2 flex flex-col justify-center items-center gap-10">
        <h1 className="font-primary text-5xl dark:text-white text-black">Signup</h1>
        <div className="flex flex-col gap-5 justify-center items-center">
          <form onSubmit={handleSubmit} className="gap-5 flex flex-col">
            <InputBox placeholder="Username" type="text" name="username" />
            <InputBox placeholder="Password" type="password" name="password" />
            <InputBox placeholder="Confirm Password" type="password" name="confirmPassword" />
            <Button text="Submit" variant="primary" size="md" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export const LogoutMenu = ({ handleLogout }: { handleLogout: () => void }) => {
  const username: string = localStorage.getItem("username") || "";
  return (
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", ease: ["easeIn", "easeOut"] }}
      className="absolute z-100 top-16 right-22 w-50 h-60 flex justify-center items-center gap-5 flex-col bg-gray-400  dark:bg-primaryBlack  rounded border-2 border-whiteOrange dark:border-blackOrange hover:border-3"
    >
      <div className="w-3/4 font-primary text-xl text-white relative flex justify-center items-center">
        <span className="relative z-10">Username</span>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
      </div>
      <Tabs text={username} size="lg" variant="navTabs"></Tabs>
      <Button text="Logout" size="md" variant="secondary" onClick={handleLogout} />
    </motion.div>
  );
};
