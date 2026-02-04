import { addMembershipToProjectFlow } from "../../../../flows";
import { ACCESS_ROLES } from "../../../../utils/accessRoles";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { projectId, membershipId, accessRole, workRole, multiplier } =
    req.body;

  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");
  if (!membershipId) throw new InvalidParamsError("membershipId is required");
  if (typeof membershipId !== "string")
    throw new InvalidParamsError("membershipId must be a string");
  if (!accessRole) throw new InvalidParamsError("accessRole is required");
  if (!ACCESS_ROLES.includes(accessRole))
    throw new InvalidParamsError("accessRole must be a string");
  if (!workRole) throw new InvalidParamsError("workRole is required");
  if (typeof workRole !== "string")
    throw new InvalidParamsError("workRole must be a string");
  if (!multiplier) throw new InvalidParamsError("multiplier is required");
  if (typeof multiplier !== "number")
    throw new InvalidParamsError("multiplier must be a number");

  return addMembershipToProjectFlow(
    projectId,
    { membershipId, accessRole, workRole, multiplier },
    actorMembership,
  );
});
