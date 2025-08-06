import Router from "express";
import { Request, Response } from "express";
import { orgAuth } from "../middlewares/orgAuth";
import { newContentModel, OrgModel,InviteLinkModel,ShareBrainlinkModel } from "../Database/db";
import { dashAuth } from "../middlewares/dashAuth";

const dashboardRouter = Router();






dashboardRouter.get(
  "/all",
  orgAuth,
  async (req: Request, res: Response): Promise<void> => {
    const orgId = req.orgId;

    try {
      const org = await OrgModel.findById(orgId, "admins members").lean();
      if (!org) {
        res.status(400).json({ error: "Organization not found" });
        return;
      }

      const numAdmins = org.admins.length;
      const numMembers = org.members.length;

      const numLinks = await newContentModel.countDocuments({
        userId: orgId,
      });

      res.status(200).json({
        admins: numAdmins,
        members: numMembers,
        links: numLinks,
      });
    } catch (err) {
      console.error("Error fetching stats for org", orgId, err);
      res.status(500).json({ error: "Server error" });
      return;
    }
  }
);

dashboardRouter.get(
  "/admins",
  orgAuth,
  async (req: Request, res: Response): Promise<void> => {
    const orgId = req.orgId;

    const org = await OrgModel.findById(orgId, "admins")
      .populate({
        path: "admins",
        select: "username",
      })
      .lean();

    if (!org) {
      res.status(400).json({ error: "Organization not found" });
      return;
    }

    res.status(200).json({ admins: org.admins });
  }
);

dashboardRouter.get(
  "/members",
  orgAuth,
  async (req: Request, res: Response): Promise<void> => {
    const orgId = req.orgId;

    const org = await OrgModel.findById(orgId, "members")
      .populate({
        path: "members",
        select: "username",
      })
      .lean();

    if (!org) {
      res.status(400).json({ error: "Organization not found" });
      return;
    }

    res.status(200).json({ members: org.members });
  }
);

async function loadOrg(orgId: string, userId: string) {
  return OrgModel.findOne({
    _id: orgId,
    $or: [
      { createdBy: userId },
      { members: userId },
      { admins:   userId },
    ],
  });
}


//creator or admin route to make a memebr admin 
dashboardRouter.post(
  "/members/:memberId/make-admin",
  dashAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId  = req.orgId!;
      const userId = req.userId!; // creator or admin 
      const { memberId } = req.params;

      const org = await loadOrg(orgId, userId);
      if (!org) {
        res.status(404).json({ error: "Organization not found or access denied. Signin again" });
        return;
      }

      // Only creator or existing admin may promote
      const isCreator = org.createdBy.toString() === userId;
      const isAdmin   = org.admins.map(a => a.toString()).includes(userId);
      if (!isCreator && !isAdmin) {
        res.status(403).json({ error: "Not authorized to make admin" });
        return;
      }

      // Ensure target is a current member
      if (!org.members.map(m => m.toString()).includes(memberId)) {
        res.status(400).json({ error: "User is not a member" });
        return;
      }

      // Promote to admin (if not already)
      if (!org.admins.map(a => a.toString()).includes(memberId.toString())) {
        org.admins.push(memberId as any);
      }

      // Optionally remove from members array
      org.members = org.members.filter(m => m.toString() !== memberId);

      await org.save();
      res.status(200).json({ message: "User promoted to admin" });
      return;
    } catch (err) {
      console.error("make-admin error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

//admin to member
dashboardRouter.post(
  "/admins/:adminId/demote",
  dashAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId   = req.orgId!;
      const userId  = req.userId!;
      const { adminId } = req.params;

      // 1) Load org and confirm user has access
      const org = await loadOrg(orgId, userId);
      if (!org) {
        res.status(404).json({ error: "Organization not found or access denied" });
        return;
      }

      // 2) Only the org creator can demote admins
      if (org.createdBy.toString() !== userId) {
        res.status(403).json({ error: "Not authorized to demote admin" });
        return;
      }

      // 3) Remove from admins array
      org.admins = org.admins.filter(a => a.toString() !== adminId);

      // 4) Add back to members array if not already there
      if (!org.members.map(m => m.toString()).includes(adminId)) {
        org.members.push(adminId.toString() as any);
      }

      // 5) Persist changes
      await org.save();
      res.status(200).json({ message: "Admin demoted to member" });
    } catch (err) {
      console.error("demote-admin error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


dashboardRouter.delete(
  '/users/:userToRemoveId',
  dashAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { orgId, userId } = req;
      const { userToRemoveId } = req.params;

      // 1) Load the organization and confirm the requesting user has access
      const org = await loadOrg(orgId!, userId!);
      if (!org) {
        res.status(404).json({ error: "Organization not found or access denied" });
        return;
      }

      const creatorId = org.createdBy.toString();
      const isRequesterAdmin = org.admins.some(admin => admin.toString() === userId);
      const isTargetAdmin = org.admins.some(admin => admin.toString() === userToRemoveId);

      // 2) The organization creator cannot be removed
      if (userToRemoveId === creatorId) {
        res.status(400).json({ error: "The organization creator cannot be removed." });
        return;
      }

      // 3) Authorization Check: Determine if the requester has permission
      if (isTargetAdmin) {
        // Case A: Removing an Admin
        // Only the organization creator can remove another admin.
        if (userId !== creatorId) {
          res.status(403).json({ error: "Only the organization creator can remove an admin." });
          return;
        }
      } else {
        // Case B: Removing a Member
        // The requester must be the creator OR an admin.
        if (userId !== creatorId && !isRequesterAdmin) {
          res.status(403).json({ error: "You must be an admin or the creator to remove a member." });
          return;
        }
      }

      // 4) Perform the removal from both arrays to be safe
      org.admins = org.admins.filter(id => id.toString() !== userToRemoveId);
      org.members = org.members.filter(id => id.toString() !== userToRemoveId);

      // 5) Persist the changes to the database
      await org.save();
      res.status(200).json({ message: 'User removed from organization successfully.' });

    } catch (err) {
      console.error("remove-member error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


dashboardRouter.delete(
  "/organization",
  dashAuth,
  async (req: Request, res: Response): Promise<void> => {
    const { orgId, userId } = req; 
    try {
      // 1. Load the organization and verify user's access
      const org = await loadOrg(orgId!, userId!);
      if (!org) {
        res.status(404).json({ error: "Organization not found or access denied." });
        return;
      }

      const isCreator = org.createdBy.toString() === userId;

      // 2. Handle the action based on the user's role
      if (isCreator) {
        
        // a) Delete all content associated with the organization
        await newContentModel.deleteMany({ userId: org._id });
        
        // b) Delete all pending invitation links for the organization
        await InviteLinkModel.deleteMany({ orgId: org._id });

        // c) Delete the public share link for the organization
        await ShareBrainlinkModel.deleteOne({ userId: org._id, type: 'organization' });

        // d) Delete the organization itself
        await OrgModel.deleteOne({ _id: org._id });

        res.status(200).json({ message: "Organization and all associated data have been deleted successfully." });

      } else {
        // --- SCENARIO B: EXIT ORGANIZATION (for Admins and Members) ---

        // a) Remove the user from both arrays to be safe
        org.admins = org.admins.filter(id => id.toString() !== userId);
        org.members = org.members.filter(id => id.toString() !== userId);

        // b) Save the updated organization document
        await org.save();

        res.status(200).json({ message: "You have successfully exited the organization." });
      }

    } catch (error) {
      console.error("Error during organization delete/exit:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  }
);



export default dashboardRouter;
