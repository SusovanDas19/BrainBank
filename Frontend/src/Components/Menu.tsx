import { useRef } from "react";
import { Button } from "./UI/Button";
import { Tabs } from "./UI/Tabs";

import useClickOutside from "../customHooks/useClickOutside";
import { useRecoilState, useSetRecoilState } from "recoil";
import { showMenuAtom } from "../store/atoms/menuAtom";

import { dashboardAtom, shareBBAtom } from "../store/atoms/brainBankFeatures";

interface MenuProps {
  handleLogout: () => void;
}

export const Menu = ({ handleLogout }: MenuProps) => {
  const username: string = localStorage.getItem("usernameBB") || "";
  const logOutRef = useRef<HTMLDivElement>(null);
  const setShowMenu = useSetRecoilState(showMenuAtom);
  const [activeDashboard, setActiveDashBoard] = useRecoilState(dashboardAtom);
  const [activeShareBrain, setActiveShareBrain] = useRecoilState(shareBBAtom);
  const profileVarient = localStorage.getItem("profileVarientBB");
  const userType = localStorage.getItem("userType");
  const shouldShare =
    profileVarient === "MyOrg"
      ? userType === "Creator" || userType === "Admin"
      : true;

  useClickOutside(logOutRef, () => {
    setShowMenu(false);
  });

  return (
    <div
      className="absolute z-50 top-2 right-5 h-65 w-40 md:w-50 md:h-70 flex justify-center items-center gap-8 flex-col bg-white  dark:bg-primaryBlack  rounded-sm rounded-tl-4xl rounded-br-4xl border-2 border-whiteOrange dark:border-blackOrange hover:border-3"
      ref={logOutRef}
    >
      <div className="w-3/4 font-primary text-xl text-white relative flex justify-center items-center flex-col">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
        <Tabs text={username} size="lg" variant="navTabs"></Tabs>
      </div>

      <div className="w-full flex flex-col gap-2 justify-center items-center">
        {profileVarient === "MyOrg" && (
          <Tabs
            variant="navTabs"
            size="lg"
            text="Dashboard"
            onClick={() => {
              setActiveDashBoard(!activeDashboard);
              setActiveShareBrain(false);
              setShowMenu(false);
            }}
          />
        )}

        {shouldShare && (
          <Tabs
            variant="navTabs"
            size="lg"
            text="Share Brain"
            onClick={() => {
              setActiveShareBrain(!activeShareBrain);
              setActiveDashBoard(false);
              setShowMenu(false);
            }}
          />
        )}

        <div className="mt-5">
          <Button
            text="Logout"
            size="sm"
            variant="primary"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};
