import { useRecoilValue, useSetRecoilState } from "recoil";
import { motion } from "motion/react";
import { InputBox } from "./UI/InputBox";
import { signInUpToggel } from "../store/atoms/signInUpToggel";
import { Button } from "./UI/Button";
import axios from "axios";
import { useToast } from "./UI/ToastProvider";
import { FormEvent, useState } from "react";

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMediaQuery } from "../customHooks/useMediaQuery";

export const Auth = () => {
  const signInUp = useRecoilValue(signInUpToggel);
  const setShowSignInUp = useSetRecoilState(signInUpToggel);
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode");
  useEffect(() => {
    if (mode === "org-signup") {
      setShowSignInUp("signup");
    }
  }, [searchParams, setShowSignInUp]);

  return (
    <div
      className={`h-screen ${
        mode === "org-signup" && "mt-15 md:pr-20"
      } bg-white dark:bg-primaryBlack flex justify-center items-center pb-10`}
    >
      <div className="md:h-[500px] h-96 w-90 md:w-4xl flex flex-row bg-transparent rounded-xl dark:shadow-[0px_2px_5px_black] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
        {signInUp === "signin" ? <Signin /> : <Signup />}
      </div>
    </div>
  );
};

export const Signin = () => {
  const setShowSignInUp = useSetRecoilState(signInUpToggel);
  const [isDefault, setDefault] = useState<boolean>(true);
  const { addToast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");

  const clearForm = () => {
    setUsername("");
    setPassword("");
    setOrgName("");
  };

  const handleFormToggle = () => {
    clearForm();
    setDefault(!isDefault);
  };

  const handleUserSignin = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://api.brainbank.cv/v1/user/signin",
        { username, password }
      );
      localStorage.setItem("tokenBB", response.data.token);
      localStorage.setItem("usernameBB", response.data.username);
      localStorage.setItem("profileVarientBB", "MyBrain");

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
          message: `${error.response?.data?.message || "An error occurred."}`,
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

  const handleOrgSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("https://api.brainbank.cv/v1/org/signin", {
        OrgName: orgName,
        username,
        password,
      });
      localStorage.setItem("tokenBB", response.data.token);
      localStorage.setItem("OrgNameBB", response.data.OrgName);
      localStorage.setItem("usernameBB", response.data.username);
      localStorage.setItem("profileVarientBB", "MyOrg");
      localStorage.setItem("userType", `${response.data.type}`);

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
          message: `${error.response?.data?.message || "An error occurred."}`,
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
    <div className="w-full h-90 md:h-full flex flex-row justify-center items-center">
      <div
        className={`flex flex-col justify-center items-center py-8 ${
          isDesktop ? "w-1/2" : "w-full"
        }`}
      >
        <h1
          className={`font-primary text-4xl md:text-5xl dark:text-white text-black ${
            isDefault ? "mb-2 md:mb-10" : "mb-10 md:mb-5"
          } `}
        >
          Signin
        </h1>
        <motion.div className="flex flex-col gap-3 justify-center items-center mb-10">
          {isDefault ? (
            <form onSubmit={handleUserSignin} className="flex flex-col gap-5">
              <InputBox
                variant="auth"
                placeholder="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <InputBox
                variant="auth"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
              <InputBox
                variant="auth"
                placeholder="Your Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <InputBox
                variant="auth"
                placeholder="Your Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button text="Submit" variant="primary" size="md" type="submit" />
            </form>
          )}
        </motion.div>

        <Button
          variant="tertiary"
          size="lg"
          text={`${
            isDefault
              ? "Signin into your Org BrainBank"
              : "Signin into your BrainBank"
          }`}
          onClick={handleFormToggle}
        />
        {!isDesktop && (
          <p  className="mt-8 text-center text-black dark:text-white">
            Don't have an account?{" "}
            <button
              onClick={() => setShowSignInUp("signup")}
              className="font-semibold text-whiteOrange dark:text-blackOrange hover:underline"
            >
              Signup
            </button>
          </p>
        )}
      </div>
    {isDesktop && (
        <motion.div initial={{ x: -450, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, ease: "anticipate" }} className="w-1/2 h-full rounded-r-xl z-100 gap-18 flex flex-col justify-center items-center font-primary bg-whiteOrange dark:bg-blackOrange">
          <h1 className="text-5xl font-medium text-white">Hello, Friend!</h1>
          <p className="text-center text-xl font-medium">Don't have an account then register<br /> and use our services</p>
          <Button text="Signup" variant="secondary" size="sm" onClick={() => setShowSignInUp("signup")} />
        </motion.div>
      )}
    </div>
  );
};

export const Signup = () => {
  const setShowSignInUp = useSetRecoilState(signInUpToggel);
  const [isDefault, setDefault] = useState<boolean>(true);
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const mode = searchParams.get("mode");
  useEffect(() => {
    if (mode === "org-signup") {
      setDefault(false);
    }
  }, [searchParams]);

  const clearForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setOrgName("");
  };

  const handleFormToggle = () => {
    clearForm();
    setDefault(!isDefault);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      addToast({
        type: "error",
        message: "Passwords do not match.",
        size: "md",
      });
      return;
    }
    try {
      await axios.post("https://api.brainbank.cv/v1/user/signup", {
        username,
        password,
        confirmPassword
      });
      addToast({
        type: "success",
        message: "Signup successful. Please sign in.",
        size: "md",
      });
      setShowSignInUp("signin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        addToast({
          type: "error",
          message: `${error.response?.data?.message || "An error occurred."}`,
          size: "md",
        });
      } else {
        addToast({
          type: "failure",
          message: "Internal server error",
          size: "md",
        });
      }
    }
  };

  const handleOrgSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("https://api.brainbank.cv/v1/org/signup", {
        username,
        password,
        OrgName: orgName,
      });
      if (response.status === 201) {
        addToast({
          type: "success",
          message: "Organization created! Please sign in.",
          size: "md",
        });
        setShowSignInUp("signin");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        addToast({
          type: "error",
          message: `${error.response?.data?.message || "An error occurred."}`,
          size: "md",
        });
      } else {
        addToast({
          type: "failure",
          message: "Internal server error",
          size: "md",
        });
      }
    }
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      {isDesktop && (
        <motion.div
          initial={{ x: 450, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "anticipate" }}
          className="w-1/2 h-full rounded-l-xl z-100  gap-18 flex flex-col justify-center items-center font-primary bg-whiteOrange dark:bg-blackOrange"
        >
          <h1 className="text-5xl font-medium text-white">Welcome Back!</h1>
          <p className="text-center text-xl font-medium text-gray-900">
            Already have an account?
            <br /> Sign in with your credentials.
          </p>
          <Button
            text="Signin"
            variant="secondary"
            size="sm"
            onClick={() => setShowSignInUp("signin")}
          />
        </motion.div>
      )}
      <div className={`flex flex-col justify-center items-center gap-10  py-8 ${isDesktop ? 'w-1/2' : 'w-full'}`}>
        <h1 className="font-primary text-3xl md:text-5xl dark:text-white text-black">
          {isDefault ? "Create Account" : "Register Organization"}
        </h1>
        <div className="flex flex-col gap-5 justify-center items-center">
          {isDefault ? (
            <form onSubmit={handleSubmit} className="gap-5 flex flex-col">
              <InputBox
                variant="auth"
                placeholder="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <InputBox
                variant="auth"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputBox
                variant="auth"
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
              <InputBox
                variant="auth"
                placeholder="Your Username (Creator)"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <InputBox
                variant="auth"
                placeholder="Your Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                text="Create Organization"
                variant="primary"
                size="md"
                type="submit"
              />
            </form>
          )}
        </div>
        <Button
          variant="tertiary"
          size="lg"
          text={`${
            isDefault
              ? "Register your Organization"
              : "Create a Personal Account"
          }`}
          onClick={handleFormToggle}
        />

        {!isDesktop && (
          <p className="mt-8 text-center text-black dark:text-white">
             Already have an account?{' '}
            <button onClick={() => setShowSignInUp("signin")} className="font-semibold text-whiteOrange dark:text-blackOrange hover:underline">
              Signin
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
