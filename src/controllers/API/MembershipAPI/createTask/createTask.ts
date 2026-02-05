import { createTaskFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const {
    projectId,
    assignedMembershipId,
    workRoleId,
    jobId,
    name,
    startDate,
    dueDate,
    doneDate,
    duration,
    notes,
  } = req.body;

  if (!name) throw new InvalidParamsError("name is required");
  if (typeof name !== "string")
    throw new InvalidParamsError("name must be a string");
  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string" && projectId !== null)
    throw new InvalidParamsError("projectId must be a string or null");
  if (
    assignedMembershipId &&
    typeof assignedMembershipId !== "string" &&
    assignedMembershipId !== null
  )
    throw new InvalidParamsError(
      "assignedMembershipId must be a string or null",
    );

  if (jobId && typeof jobId !== "string" && jobId !== null)
    throw new InvalidParamsError("jobId must be a string or null");
  if (workRoleId && typeof workRoleId !== "string" && workRoleId !== null)
    throw new InvalidParamsError("workRoleId must be a string or null");

  if (startDate && startDate !== null) {
    if (typeof startDate !== "string") {
      throw new InvalidParamsError("startDate must be a string or null");
    }
    if (isNaN(new Date(startDate).getTime()))
      throw new InvalidParamsError("startDate must be a valid date string");
  }

  if (dueDate && dueDate !== null) {
    if (typeof dueDate !== "string") {
      throw new InvalidParamsError("dueDate must be a string or null");
    }
    if (isNaN(new Date(dueDate).getTime()))
      throw new InvalidParamsError("dueDate must be a valid date string");
  }

  if (doneDate && doneDate !== null) {
    if (typeof doneDate !== "string") {
      throw new InvalidParamsError("doneDate must be a string or null");
    }
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

  if (notes && typeof notes !== "string" && notes !== null)
    throw new InvalidParamsError("notes must be a string or null");

  return createTaskFlow(req.body, actorMembership);
});
