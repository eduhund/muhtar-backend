import { updateTaskFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const {
    id,
    projectId,
    assignedMembershipId,
    workRoleKey,
    jobId,
    startDate,
    dueDate,
    doneDate,
    duration,
    notes,
  } = req.body;

  if (!id) throw new InvalidParamsError("id is required");
  if (typeof id !== "string")
    throw new InvalidParamsError("id must be a string");

  if (assignedMembershipId && typeof assignedMembershipId !== "string")
    throw new InvalidParamsError("assignedMembershipId must be a string");

  if (projectId && typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");

  if (workRoleKey && typeof workRoleKey !== "string")
    throw new InvalidParamsError("workRoleKey must be a string");

  if (jobId && typeof jobId !== "string")
    throw new InvalidParamsError("jobId must be a string");

  if (startDate && startDate !== null) {
    if (typeof startDate !== "string")
      throw new InvalidParamsError("startDate must be a string");
    if (isNaN(new Date(startDate).getTime()))
      throw new InvalidParamsError("startDate must be a valid date string");
  }
  if (dueDate && dueDate !== null) {
    if (typeof dueDate !== "string")
      throw new InvalidParamsError("dueDate must be a string");
    if (isNaN(new Date(dueDate).getTime()))
      throw new InvalidParamsError("dueDate must be a valid date string");
  }
  if (doneDate && doneDate !== null) {
    if (typeof doneDate !== "string")
      throw new InvalidParamsError("doneDate must be a string");
    if (isNaN(new Date(doneDate).getTime()))
      throw new InvalidParamsError("doneDate must be a valid date string");
  }
  if (duration) {
    if (Array.isArray(duration)) {
      if (duration.length !== 2 || isNaN(duration[0]) || isNaN(duration[1])) {
        throw new InvalidParamsError(
          "duration array must contain two valid numbers",
        );
      }
    } else if (isNaN(duration)) {
      throw new InvalidParamsError("duration must be a valid number");
    }
  }
  if (notes && typeof notes !== "string")
    throw new InvalidParamsError("notes must be a string");

  await updateTaskFlow(id, req.body, actorMembership);
  return {};
});
