import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateCreateTaskParams(
  req: any,
  res: any,
  next: any
) {
  const {
    assignedMembershipId,
    assignedProjectId,
    name,
    startDate,
    dueDate,
    duration,
    notes,
  } = req.body;
  if (!name) throw new InvalidParamsError("name is required");
  if (typeof name !== "string")
    throw new InvalidParamsError("name must be a string");
  if (
    assignedMembershipId &&
    typeof assignedMembershipId !== "string" &&
    assignedMembershipId !== null
  )
    throw new InvalidParamsError(
      "assignedMembershipId must be a string or null"
    );
  if (
    assignedProjectId &&
    typeof assignedProjectId !== "string" &&
    assignedProjectId !== null
  )
    throw new InvalidParamsError("assignedProjectId must be a string or null");
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
  if (duration !== undefined && duration !== null && isNaN(duration))
    throw new InvalidParamsError("duration must be a valid number or null");
  if (notes && typeof notes !== "string" && notes !== null)
    throw new InvalidParamsError("notes must be a string or null");

  return next();
}
