import { AnimatePresence, motion } from "motion/react";
import { Tabs } from "./UI/Tabs";
import axios from "axios";
import { useState } from "react";
import { InputBox } from "./UI/InputBox";
import { Button } from "./UI/Button";
import { useToast } from "./UI/ToastProvider";
import { isAxiosError } from "axios";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { useRecoilState, useSetRecoilState } from "recoil";
import { swtichMenuAtom } from "../store/atoms/dropMenuAtom";

export const DropDownMenu = () => {
  const [showSwitch, setShowSwitch] = useRecoilState(swtichMenuAtom);
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
          className="w-32 h-32 z-100 md:left-68  flex justify-center items-start flex-col gap-3 font-primary bg-gray-300 dark:bg-secondaryBlack rounded-lg border border-whiteOrange dark:border-blackOrange p-2"
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
      {showSwitch && (
        <div className="fixed top-50 right-5 w-80 md:left-55 inset-0 items-center justify-center">
          <SwitchData />
        </div>
      )}
    </div>
  );
};

const SwitchData = () => {
  const currProfileVarient: string =
    localStorage.getItem("profileVarientBB") || "";
  const { addToast } = useToast();
  const [hasAffiliation, setHasAffiliation] = useState<boolean>(true);
  const setSwitchMenu = useSetRecoilState(swtichMenuAtom);

  const switchToMyBrain = async (event: React.FormEvent) => {
    event.preventDefault();
    if (currProfileVarient === "MyBrain") return;

    const token = localStorage.getItem("tokenBB");
    const formData = new FormData(event.target as HTMLFormElement);

    const data = {
      username: localStorage.getItem("usernameBB"),
      OrgName: localStorage.getItem("OrgNameBB"),
      password: formData.get("password"),
      userType: localStorage.getItem("userType"),
    };
    try {
      const response = await axios.post(
        "https://api.brainbank.cv/v1/switch/user/signin",
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
        localStorage.removeItem("userType");
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
      password: formData.get("password"),
    };
    try {
      const response = await axios.post(
        "https://api.brainbank.cv/v1/switch/org/signin",
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
          message: "Switched to MyOrg",
        });
        localStorage.setItem("tokenBB", response.data.token);
        localStorage.setItem("profileVarientBB", "MyOrg");
        localStorage.setItem("OrgNameBB", response.data.OrgName);
        localStorage.setItem("userType", response.data.type);

        window.location.href = "/";
      }
    } catch (err: any) {
      if (
        isAxiosError(err) &&
        err.response?.status === 400 &&
        err.response.data.message.includes("not affiliated")
      ) {
        setHasAffiliation(false);
        console.log(currProfileVarient);
      }
      const errorMsg =
        err.response?.data?.message || "An unexpected error occurred.";
      addToast({ type: "failure", message: errorMsg, size: "md" });
    }
  };

  const openOrgSignup = () => {
    window.open("/auth?mode=org-signup", "_blank");
  };

  return (
    <div className="w-82 ml-10 bg-gray-300 dark:bg-secondaryBlack p-5 rounded border border-gray-800 dark:border-white">
      <motion.div
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        onClick={() => setSwitchMenu(false)}
        className={`absolute cursor-pointer ${
          currProfileVarient === "MyOrg" ? "top-25 left-80" : "left-80 top-40"
        } text-2xl hover:bg-red-600/20 p-1 pl-2 pr-2 rounded hover:border hover:border-red-600 text-gray-500 hover:dark:text-white hover:text-black`}
      >
        <MdOutlineCancelPresentation />
      </motion.div>
      {currProfileVarient === "MyOrg" ? (
        <form onSubmit={switchToMyBrain} className="flex flex-col gap-3">
          <InputBox
            variant="auth"
            placeholder="Password"
            type="password"
            name="password"
          />
          <Button
            text="Switch to Personal"
            variant="primary"
            size="md"
            type="submit"
          />
        </form>
      ) : hasAffiliation ? (
        <form onSubmit={switchToMyOrg} className="flex flex-col gap-3">
          <InputBox
            variant="auth"
            placeholder="Organization Name"
            type="text"
            name="OrgName"
          />
          <InputBox
            variant="auth"
            placeholder="Your profile password"
            type="password"
            name="password"
          />
          <Button
            text="Switch to Org"
            variant="primary"
            size="md"
            type="submit"
          />
        </form>
      ) : (
        <div className="h-39 text-center">
          <p className="text-lg text-gray-300 mb-6">
            You are not a member of any organization yet.
          </p>
          <Button
            variant="secondary"
            size="lg"
            text="Register Your Organization"
            onClick={openOrgSignup}
          />
        </div>
      )}
    </div>
  );
};
