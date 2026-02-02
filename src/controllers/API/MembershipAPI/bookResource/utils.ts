import { dateOnlyIsoString } from "../../../../utils/date";
import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateBookResourceParams(
  req: any,
  res: any,
  next: any,
) {
  const { projectId, period, date, target, resource } = req.body;
  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");
  if (period && !["day", "week", "month"].includes(period))
    throw new InvalidParamsError(
      "period must be one of 'day', 'week', or 'month'",
    );
  if (!date) req.body.date = dateOnlyIsoString(new Date());
  if (typeof date !== "string")
    throw new InvalidParamsError("date must be a string");
  if (isNaN(new Date(date).getTime()))
    throw new InvalidParamsError("date must be a valid date string");
  if (!target) throw new InvalidParamsError("target is required");
  if (typeof target !== "object")
    throw new InvalidParamsError("target must be an object");
  if (!target.type || !["worker", "role"].includes(target.type))
    throw new InvalidParamsError(
      "target.type must be one of 'worker' or 'role'",
    );
  if (!target.id || typeof target.id !== "string")
    throw new InvalidParamsError("target.id is required and must be a string");
  if (!resource) throw new InvalidParamsError("resource is required");
  if (typeof resource !== "object")
    throw new InvalidParamsError("resource must be an object");
  if (!resource.type || resource.type !== "time")
    throw new InvalidParamsError("resource.type must be 'time'");
  if (typeof resource.value !== "number")
    throw new InvalidParamsError("resource.value must be a number");

  return next();
}
