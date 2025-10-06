import { dateOnlyIsoString } from "../../../../utils/date";
import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateAddTimeParams(req: any, res: any, next: any) {
  const { projectId, taskId, date, duration, comment } = req.body;
  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string")
    throw new InvalidParamsError("projectId must be a string");
  if (!date) req.body.date = dateOnlyIsoString(new Date());
  if (typeof date !== "string")
    throw new InvalidParamsError("date must be a string");
  if (isNaN(new Date(date).getTime()))
    throw new InvalidParamsError("date must be a valid date string");
  if (!duration) throw new InvalidParamsError("duration is required");
  if (isNaN(duration))
    throw new InvalidParamsError("duration must be a valid number");

  return next();
}
