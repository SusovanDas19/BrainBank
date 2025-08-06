import { ReactElement, useEffect, useState } from "react";
import { Button } from "./UI/Button";
import { AdminsMembers } from "./DashAdminTab"; 
import { useToast } from "./UI/ToastProvider";
import { SkeletonRow } from "./UI/SkeletonBlock";
import { IoPersonSharp } from "react-icons/io5";

import axios from "axios";

export const MembersTab = () => {
  const [members, setMembers] = useState<AdminsMembers[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const token = localStorage.getItem("tokenBB")!;
  const currentUsername = localStorage.getItem("usernameBB")!;
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, status } = await axios.get(
        "https://api.brainbank.cv/v1/dashboard/members",
        { headers: { Authorization: `${token}` } }
      );
      if (status === 200) {
        setMembers(data.members);
      }
    } catch (e: any) {
      const msg =
        axios.isAxiosError(e) && e.response?.data?.error
          ? e.response.data.error
          : "Internal server error";
      addToast({
        type:
          axios.isAxiosError(e) && e.response?.status === 400
            ? "error"
            : "failure",
        size: "md",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // promote
  const handleMakeAdmin = async (memberId: string) => {
    try {
      const { status } = await axios.post(
        `https://api.brainbank.cv/v1/dashboard/members/${memberId}/make-admin`,
        { username: currentUsername },
        { headers: { Authorization: `${token}` } }
      );
      if (status === 200) {
        addToast({
          type: "success",
          size: "md",
          message: "Promoted to admin!",
        });
        fetchMembers();
      }
    } catch (e: any) {
      const msg = e.response?.data?.error ?? "Something went wrong.";
      addToast({
        type: e.response?.status === 400 ? "error" : "failure",
        size: "md",
        message: msg,
      });
    }
  };

  // remove
  const handleRemove = async (adminId: string) => {
    try {
      const { status } = await axios.delete(
        `https://api.brainbank.cv/v1/dashboard/users/${adminId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
          data: {
            username: currentUsername,
          },
        }
      );

      if (status === 200) {
        addToast({
          type: "success",
          size: "md",
          message: "User removed from organization!",
        });
        fetchMembers();
      }
    } catch (e: any) {
      const msg = e.response?.data?.error ?? "Something went wrong.";
      addToast({
        type: "failure",
        size: "md",
        message: msg,
      });
    }
  };

  const renderSkeletons = () =>
    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />);

  return (
    <div className="w-full flex font-primary justify-center items-center flex-col gap-10 md:gap-15">
      <h1 className="text-xl md:text-2xl dark:text-white">
        Members of your Organization's BrainBank
      </h1>
      <div className="flex flex-col gap-2 w-full md:px-10">
        {loading ? (
          renderSkeletons()
        ) : members && members.length > 0 ? (
          members.map((member, idx) => (
            <MemberList
              key={member._id}
              memberId={member._id}
              name={member.username}
              type={idx % 2 === 0 ? "odd" : "even"}
              icon={<IoPersonSharp />}
              onMakeAdmin={handleMakeAdmin}
              onRemove={handleRemove}
              disable={userType === "Member" && true}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-lg">
            No member found for this organization.
          </div>
        )}
      </div>
    </div>
  );
};

export interface MemberListProps {
  memberId: string;
  name: string;
  type: "odd" | "even";
  icon: ReactElement;
  onMakeAdmin: (memberId: string) => void;
  onRemove: (memberId: string) => void;
  disable: boolean;
}



export interface MemberListProps {
  memberId: string;
  name: string;
  type: "odd" | "even";
  icon: ReactElement;
  onMakeAdmin: (memberId: string) => void;
  onRemove: (memberId: string) => void;
  disable: boolean;
}

const typeStyle = {
  odd: "dark:bg-gray-800 bg-gray-200",
  even: "",
};


export const MemberList = ({
  memberId,
  name,
  type,
  icon,
  onMakeAdmin,
  onRemove,
  disable,
}: MemberListProps) => {
  return (
    <div
      className={`
        flex flex-row font-primary w-fit md:w-full justify-between items-center px-4 group py-2 rounded-md
        ${typeStyle[type]}
      `}
    >
      
      <div className="flex flex-1 items-center gap-5 cursor-pointer min-w-50">
        <span className="md:invisible group-hover:visible text-lg md:text-2xl dark:text-white">
          {icon}
        </span>
        <p className="truncate text-xl md:text-2xl dark:text-white">{name}</p>
      </div>

      {!disable && (
        <div className="flex flex-row flex-shrink-0 items-center gap-4 md:invisible group-hover:visible">
          <Button
            variant="dashbutton1"
            size="md"
            text="Make org Admin"
            onClick={() => onMakeAdmin(memberId)}
          />

          <Button
            variant="dashbutton2"
            size="md"
            text="Remove from org"
            onClick={() => onRemove(memberId)}
          />
        </div>
      )}
    </div>
  );
};
