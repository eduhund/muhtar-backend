import { getResourcesFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { checkDateString, withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { projectId, membershipId, date, from, to, withArchived } = req.query;

  if (projectId && typeof projectId !== "string") {
    throw new InvalidParamsError("'projectId' must be a string");
  }
  if (membershipId && typeof membershipId !== "string") {
    throw new InvalidParamsError("'membershipId' must be a string");
  }
  date && typeof date === "string" && checkDateString(date);
  from && typeof from === "string" && checkDateString(from);
  to && typeof to === "string" && checkDateString(to);

  if (withArchived && withArchived !== "true" && withArchived !== "false") {
    throw new InvalidParamsError(
      "'withArchived' must be boolean-type string: 'true' or 'false'",
    );
  }

  return getResourcesFlow(req.query, actorMembership);
});
