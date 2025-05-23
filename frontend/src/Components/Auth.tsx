import { useRecoilValue, useSetRecoilState } from "recoil";
import { motion } from "motion/react";
import { InputBox } from "./UI/InputBox";
import { signInUpToggel } from "../store/atoms/signInUpToggel";
import { Button } from "./UI/Button";
import axios from "axios";
import { useToast } from "./UI/ToastProvider";
import { useState } from "react";

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
  const [isDefault, setDefault] = useState<boolean>(true);
  const { addToast } = useToast();

  const handleUserSignin = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/v1/user/signin",
        data
      );
      localStorage.setItem("tokenBB", response.data.token);
      localStorage.setItem("usernameBB", response.data.username);
      localStorage.setItem("profileVarientBB", "MyBrain");

      console.log("setting");
      addToast({
        type: "success",
        size: "md",
        message: "Login successful",
      });
      window.location.href = "/";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        addToast({
          type: "error",
          size: "md",
          message: `${
            error.response?.data?.message ||
            "An error occurred. Please try again."
          } `,
        });
      } else {
        addToast({
          type: "failure",
          size: "md",
          message: "Internal server error",
        });
      }
    }
  };

  const handleOrgSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      OrgName: formData.get("OrgName"),
      OrgPassword: formData.get("OrgPassword"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/v1/org/signin",
        data
      );
      localStorage.setItem("tokenBB", response.data.token);
      localStorage.setItem("OrgNameBB", response.data.OrgName);
      localStorage.setItem("usernameBB", response.data.username);
      localStorage.setItem("profileVarientBB", "MyOrg");

      addToast({
        type: "success",
        size: "md",
        message: "Login successful",
      });
      window.location.href = "/";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        addToast({
          type: "error",
          size: "md",
          message: `${
            error.response?.data?.message ||
            "An error occurred. Please try again."
          } `,
        });
      } else {
        addToast({
          type: "failure",
          size: "md",
          message: "Internal server error",
        });
      }
    }
  };

  return (
    <div className=" w-full flex flex-row justify-center items-center">
      <div className=" w-1/2 flex flex-col  justify-center items-center">
        <h1
          className={`font-primary text-5xl dark:text-white text-black ${
            isDefault ? "mb-10" : "mb-5"
          }`}
        >
          Signin
        </h1>
        <div className="flex flex-col gap-3 justify-center items-center mb-10">
          {isDefault ? (
            <form onSubmit={handleUserSignin} className="flex flex-col gap-5">
              <InputBox
                variant="auth"
                placeholder="Username"
                type="text"
                name="username"
              />
              <InputBox
                variant="auth"
                placeholder="Password"
                type="password"
                name="password"
              />
              <Button text="Submit" variant="primary" size="md" type="submit" />
            </form>
          ) : (
            <form onSubmit={handleOrgSubmit} className="flex flex-col gap-5">
              <InputBox
                variant="auth"
                placeholder="Organization Name"
                type="text"
                name="OrgName"
              />
              <InputBox
                variant="auth"
                placeholder="Organization Password"
                type="password"
                name="OrgPassword"
              />
              <InputBox
                variant="auth"
                placeholder="Your Username"
                type="text"
                name="username"
              />
              <InputBox
                variant="auth"
                placeholder="Your Password"
                type="password"
                name="password"
              />
              <Button text="Submit" variant="primary" size="md" type="submit" />
            </form>
          )}
        </div>

        <Button
          variant="tertiary"
          size="lg"
          text={`${
            isDefault
              ? "Signin as Organization member"
              : "Signin into your BrainBank"
          }`}
          onClick={() => setDefault(!isDefault)}
        />
      </div>
      <motion.div
        initial={{ x: -450 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: "anticipate" }}
        className="w-1/2 h-full rounded-r-xl z-100 gap-18 flex flex-col justify-center items-center font-primary bg-whiteOrange dark:bg-blackOrange"
      >
        <h1 className="text-5xl font-medium text-white">Hello, Friend!</h1>
        <p className="text-center text-xl font-medium">
          Don't have an account then register
          <br /> and use our services
        </p>
        <Button
          text="Signup"
          variant="secondary"
          size="sm"
          onClick={() => setShowSignInUp("signup")}
        />
      </motion.div>
    </div>
  );
};

const Signup = () => {
  const setShowSignInUp = useSetRecoilState(signInUpToggel);
  const [isDefault, setDefault] = useState<boolean>(true);
  const { addToast } = useToast();

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
      addToast({
        type: "success",
        size: "md",
        message: "Signup successful. Please sign in.",
      });
      setShowSignInUp("signin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        addToast({
          type: "error",
          size: "md",
          message: `${
            error.response?.data?.message ||
            "An error occurred. Please try again."
          } `,
        });
      } else {
        addToast({
          type: "failure",
          size: "md",
          message: "Internal server error",
        });
      }
    }
  };
  const handleOrgSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      OrgName: formData.get("OrgName"),
      OrgPassword: formData.get("OrgPassword"),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/v1/org/signup",
        data
      );

      if (response.status === 201) {
        addToast({
          type: "success",
          size: "md",
          message: "Signup successful. Please sign in.",
        });
        setShowSignInUp("signin");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        addToast({
          type: "error",
          size: "md",
          message: `${
            error.response?.data?.message ||
            "An error occurred. Please try again."
          } `,
        });
      } else {
        addToast({
          type: "failure",
          size: "md",
          message: "Internal server error",
        });
      }
    }
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <motion.div
        initial={{ x: 450 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: "anticipate" }}
        className="w-1/2 h-full rounded-l-xl z-100 gap-18 flex flex-col justify-center items-center font-primary bg-whiteOrange dark:bg-blackOrange"
      >
        <h1 className="text-5xl font-medium text-white">Welcome Back!</h1>
        <p className="text-center text-xl font-medium text-gray-900">
          Already have an account then signin
          <br /> with credentials and use our services
        </p>
        <Button
          text="Signin"
          variant="secondary"
          size="sm"
          onClick={() => setShowSignInUp("signin")}
        />
      </motion.div>
      <div className="w-1/2 flex flex-col justify-center items-center gap-10">
        <h1 className="font-primary text-5xl dark:text-white text-black">
          Signup
        </h1>
        <div className="flex flex-col gap-5 justify-center items-center">
          {isDefault ? (
            <form onSubmit={handleSubmit} className="gap-5 flex flex-col">
              <InputBox
                variant="auth"
                placeholder="Username"
                type="text"
                name="username"
              />
              <InputBox
                variant="auth"
                placeholder="Password"
                type="password"
                name="password"
              />
              <InputBox
                variant="auth"
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
              />
              <Button text="Submit" variant="primary" size="md" type="submit" />
            </form>
          ) : (
            <form onSubmit={handleOrgSubmit} className="gap-3 flex flex-col">
              <InputBox
                variant="auth"
                placeholder="Organization Name"
                type="text"
                name="OrgName"
              />
              <InputBox
                variant="auth"
                placeholder="Organization Password"
                type="password"
                name="OrgPassword"
              />
              <InputBox
                variant="auth"
                placeholder="Your Username"
                type="text"
                name="username"
              />
              <InputBox
                variant="auth"
                placeholder="Your Password"
                type="password"
                name="password"
              />
              <Button text="Submit" variant="primary" size="md" type="submit" />
            </form>
          )}
        </div>
        <Button
          variant="tertiary"
          size="lg"
          text={`${
            isDefault ? "Register your Organization" : "Create your BrainBank"
          }`}
          onClick={() => setDefault(!isDefault)}
        />
      </div>
    </div>
  );
};
