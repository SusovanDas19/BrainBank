import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Blocks } from "./UI/DashBlock";
import { SkeletonBlock } from "./UI/SkeletonBlock";
import { IoPerson } from "react-icons/io5";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FiLink } from "react-icons/fi";
import { useToast } from "./UI/ToastProvider";
import { Button } from "./UI/Button";
import { ConfirmationModal } from "./UI/ConfirmationModel";

export const HomeTab = () => {
  const [stats, setStats] = useState({ admins: 0, members: 0, links: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("tokenBB");
  const { addToast } = useToast();
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    setLoading(true);
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await axios.get(
        "https://api.brainbank.cv/v1/dashboard/all",
        { headers: { Authorization: `${token}` } }
      );
      setStats({
        admins: response.data.admins,
        members: response.data.members,
        links: response.data.links,
      });
    } catch (e) {
        addToast({ type: "failure", message: "Could not load dashboard data.", size:"md" });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    setIsModalOpen(false); 
    setActionLoading(true);
    try {
        const response = await axios.delete(
            "https://api.brainbank.cv/v1/dashboard/organization",
            { 
                headers: { Authorization: `${token}` },
                data: { username: localStorage.getItem("usernameBB") } 
            }
        );
        addToast({ type: "success", message: response.data.message, size:"md" });
        window.location.href = "/";
        localStorage.removeItem("OrgNameBB")
        localStorage.removeItem("profileVarientBB")
        localStorage.removeItem("usernameBB")
        localStorage.removeItem("tokenBB")
        localStorage.removeItem("userType")

    } catch (err: any) {
        const errorMsg = err.response?.data?.error || "An unexpected error occurred.";
        addToast({ type: "failure", message: errorMsg, size:"md" });
    } finally {
        setActionLoading(false);
    }
  };

  const blocksData = useMemo(() => [
    { type: "primary" as const, name: "Total Admins", icon: <BsFillPersonLinesFill />, count: stats.admins },
    { type: "primary" as const, name: "Total Members", icon: <IoPerson />, count: stats.members },
    { type: "secondary" as const, name: "Total Saved Links", icon: <FiLink />, count: stats.links },
  ], [stats.admins, stats.members, stats.links]);

  const actionText = userType === "Creator" ? "Delete Organization" : "Exit From Organization";
  const modalText = userType === "Creator" 
    ? "This will permanently delete the organization and all its content. This action cannot be undone."
    : "You will lose access to this organization's BrainBank. Are you sure?";

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAction}
        title={`Confirm ${actionText}`}
        message={modalText}
      />
      <div className="w-full flex justify-center items-center flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-15 justify-center items-center">
          {loading
            ? blocksData.map((b, i) => <SkeletonBlock key={i} type={b.type} />)
            : blocksData.map((b, i) => (
                <Blocks key={i} type={b.type} name={b.name} count={b.count} icon={b.icon} />
              ))}
        </div>
        <div className="mt-10">
          <Button
            text={actionLoading ? "Processing..." : actionText}
            size="md"
            variant="dashbutton2"
            onClick={() => setIsModalOpen(true)}
            disabled={actionLoading}
          />
        </div>
      </div>
    </>
  );
};
