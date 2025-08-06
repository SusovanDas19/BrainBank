import { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./UI/Button";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { useToast } from "./UI/ToastProvider";
import { SkeletonRow } from "./UI/SkeletonBlock";

export interface AdminsMembers {
  _id: string;
  username: string;
}

export const AdminsTab = () => {
  const [admins, setAdmins] = useState<AdminsMembers[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const token = localStorage.getItem("tokenBB")!;
  const currentUsername = localStorage.getItem("usernameBB")!;
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data, status } = await axios.get(
        "https://api.brainbank.cv/v1/dashboard/admins",
        { headers: { Authorization: `${token}` } }
      );
      if (status === 200) {
        setAdmins(data.admins);
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

  const handleDismiss = async (adminId: string) => {
    try {
      const { status } = await axios.post(
        `https://api.brainbank.cv/v1/dashboard/admins/${adminId}/demote`,
        { username: currentUsername },
        { headers: { Authorization: `${token}` } }
      );
      if (status === 200) {
        addToast({
          type: "success",
          size: "md",
          message: "Admin demoted to member!",
        });
        fetchAdmins();
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
        fetchAdmins();
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
    Array.from({ length: 5 }).map((_, idx) => <SkeletonRow key={idx} />);

  return (
    <div className="w-full flex font-primary justify-center items-center flex-col gap-4 md:gap-6">
      <h1 className="text-xl md:text-2xl dark:text-white">
        Admins of your Organization's BrainBank
      </h1>
      <div className="flex flex-col gap-2 w-full md:px-10">
        {loading ? (
          renderSkeletons()
        ) : admins && admins.length > 0 ? (
          admins.map((admin, idx) => (
            <AdminList
              key={admin._id}
              adminId={admin._id}
              name={admin.username}
              type={idx % 2 === 0 ? "odd" : "even"}
              icon={<BsFillPersonLinesFill />}
              onDismiss={handleDismiss}
              onRemove={handleRemove}
              disabled={userType === "Member" && true}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-400 text-lg">
            No admins found for this organization.
          </div>
        )}
      </div>
    </div>
  );
};

export interface AdminListProps {
  adminId: string;
  name: string;
  type: "odd" | "even";
  icon: ReactElement;
  onDismiss: (adminId: string) => void;
  onRemove: (adminId: string) => void;
  disabled: boolean;
}

const typeStyle = {
  odd: "dark:bg-gray-800 bg-gray-200",
  even: "",
};

const AdminList = ({
  adminId,
  name,
  type,
  icon,
  onDismiss,
  onRemove,
  disabled,
}: AdminListProps) => {
  return (
    <div
      className={`
      flex flex-row font-primary  w-fit  gap-30 md:w-full justify-between items-center px-4 group py-2 rounded-md
      ${typeStyle[type]}
    `}
    >
      <div className="w-full flex flex-row gap-5 justify-start items-center cursor-pointer min-w-50">
        <span className="md:invisible group-hover:visible text-lg md:text-2xl  dark:text-white">
          {icon}
        </span>
        <p className="truncate text-xl md:text-2xl dark:text-white">{name}</p>
      </div>
      {!disabled && (
        <div className="flex flex-row flex-shrink-0 items-center gap-4 md:invisible group-hover:visible">
          <Button
            variant="dashbutton1"
            size="md"
            text="Dismiss as Admin"
            onClick={() => onDismiss(adminId)}
            disabled={disabled}
          />
          <Button
            variant="dashbutton2"
            size="md"
            text="Remove from org"
            onClick={() => onRemove(adminId)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};
