import { InvalidParamsError } from "../../../../utils/Rejection";

function checkDateString(dateStr: string) {
  if (typeof dateStr !== "string")
    throw new InvalidParamsError("'date' must be a string");

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateStr)) {
    throw new InvalidParamsError("'date' must be in ISO format YYYY-MM-DD");
  }
}

export default function validateGetResourcesParams(
  req: any,
  res: any,
  next: any
) {
  const { projectId, membershipId, date, from, to, withArchived } = req.query;
  if (projectId && typeof projectId !== "string") {
    throw new InvalidParamsError("'projectId' must be a string");
  }
  if (membershipId && typeof membershipId !== "string") {
    throw new InvalidParamsError("'membershipId' must be a string");
  }
  date && checkDateString(date);
  from && checkDateString(from);
  to && checkDateString(to);

  if (withArchived && withArchived !== "true" && withArchived !== "false") {
    throw new InvalidParamsError(
      "'withArchived' must be boolean-type string: 'true' or 'false'"
    );
  }

  return next();
}
