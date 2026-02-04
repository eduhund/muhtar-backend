import { updateResourceFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { id, membershipId, projectId, date, target, consumed, comment } =
    req.body;

  if (!id) throw new InvalidParamsError("id is required");
  if (typeof id !== "string")
    throw new InvalidParamsError("id must be a string");
  if (membershipId && typeof membershipId !== "string")
    throw new InvalidParamsError("membershipId must be a string");
  if (projectId && typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");
  if (
    date !== undefined &&
    typeof date !== "string" &&
    isNaN(new Date(date).getTime())
  )
    throw new InvalidParamsError("date must be a valid string");
  if (target !== null && typeof target !== "object")
    throw new InvalidParamsError("target must be an object or null");
  if (consumed && isNaN(consumed))
    throw new InvalidParamsError("consumed must be a valid number");
  if (comment && typeof comment !== "string")
    throw new InvalidParamsError("comment must be a string");

  await updateResourceFlow(id, req.body, actorMembership);
  return {};
});
