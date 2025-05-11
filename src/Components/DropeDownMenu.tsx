import { AnimatePresence, motion } from "motion/react";
import { Tabs } from "./UI/Tabs";
import axios from "axios";
import { useState } from "react";
import { InputBox } from "./UI/InputBox";
import { Button } from "./UI/Button";
import { useToast } from "./UI/ToastProvider";

const pStyle =
  "text-xl font-medium items-center flex text-black dark:text-white w-full h-10 dark:hover:bg-gray-600 hover:bg-gray-400 pl-5 cursor-pointer rounded-md ";


export const DropDownMenu = () => {
  const [showSwitch, setShowSwitch] = useState<boolean>(false);
  const currProfileVarient: string =
    localStorage.getItem("profileVarientBB") || "";

  const renderSwitch = (type: string) => {
    if (type === currProfileVarient) return;
    setShowSwitch(true);
  };
  return (
    <div>
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, filter: "blur(5px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", ease: "easeInOut", duration: 1 }}
          exit={{ opacity: 0, scale: 0.4, filter: "blur(10px)" }}
          className="w-32 h-32 z-100 top-16 left-68 absolute flex justify-center items-start flex-col gap-3 font-primary bg-gray-300 dark:bg-secondaryBlack rounded-lg border border-whiteOrange dark:border-blackOrange p-2"
        >
          <div className="flex justify-center w-full flex-col gap-2">
            <Tabs
              variant="sideTabs"
              size="sm"
              text="MyOrg"
              onClick={() => renderSwitch("MyOrg")}
              tabActive={currProfileVarient === "MyOrg" && true}
            />
            <Tabs
              variant="sideTabs"
              size="sm"
              text="MyBrain"
              onClick={() => renderSwitch("MyBrain")}
              tabActive={currProfileVarient === "MyBrain" && true}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div>{showSwitch && <SwitchData />}</div>
    </div>
  );
};

const SwitchData = () => {
  const currProfileVarient: string =
    localStorage.getItem("profileVarientBB") || "";
  const { addToast } = useToast();

  const switchToMyBrain = async (event: React.FormEvent) => {
    event.preventDefault();
    if (currProfileVarient === "MyBrain") return;

    const token = localStorage.getItem("tokenBB");
    const formData = new FormData(event.target as HTMLFormElement);

    const data = {
      username: localStorage.getItem("usernameBB"),
      OrgName: localStorage.getItem("OrgNameBB"),
      password: formData.get("password"), //hardcoded
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/v1/switch/user/signin",
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        addToast({
          type: "success",
          size: "md",
          message: "Switched to MyBrain",
        });
        localStorage.setItem("tokenBB", response.data.token);
        localStorage.setItem("usernameBB", response.data.username);
        localStorage.setItem("profileVarientBB", "MyBrain");
        localStorage.removeItem("OrgNameBB");
        window.location.href = "/";
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          addToast({
            type: "error",
            size: "md",
            message: `${e.response.data.message}`,
          });
        } else {
          addToast({
            type: "failure",
            size: "md",
            message: "Internal server error",
          });
        }
      }
    }
  };

  const switchToMyOrg = async (event: React.FormEvent) => {
    event.preventDefault();

    if (currProfileVarient === "MyOrg") return;

    const token = localStorage.getItem("tokenBB");
    const formData = new FormData(event.target as HTMLFormElement);

    const data = {
      OrgName: formData.get("OrgName"),
      OrgPassword: formData.get("OrgPassword"),
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/v1/switch/org/signin",
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {

        addToast({
          type: "success",
          size: "md",
          message: "Switched to MyOrg"
        })
        localStorage.setItem("tokenBB", response.data.token);
        localStorage.setItem("profileVarientBB", "MyOrg");
        localStorage.setItem("OrgNameBB", response.data.OrgName);

        window.location.href = "/";
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          addToast({
            type: "error",
            size: "md",
            message: `${e.response.data.message}`,
          });
        } else {
          addToast({
            type: "failure",
            size: "md",
            message: "Internal server error",
          });
        }
      }
    }
  };
  return (
    <div className="absolute top-15 ml-10 bg-secondaryBlack p-5 rounded border border-white">
      {currProfileVarient === "MyOrg" ? (
        <form onSubmit={switchToMyBrain} className="flex flex-col gap-3">
          <InputBox
            variant="auth"
            placeholder="passowrd"
            type="password"
            name="password"
          />
          <Button text="Switch" variant="primary" size="md" type="submit" />
        </form>
      ) : (
        <form onSubmit={switchToMyOrg} className="flex flex-col gap-3">
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
          <Button text="Switch" variant="primary" size="md" type="submit" />
        </form>
      )}
    </div>
  );
};
