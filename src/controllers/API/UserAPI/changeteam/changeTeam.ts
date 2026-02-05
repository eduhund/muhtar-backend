import { changeTeamFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { actorUser } = req.data;
  const { teamId } = req.body;

  if (!teamId) {
    throw new InvalidParamsError("teamId is required");
  }
  if (typeof teamId !== "string") {
    throw new InvalidParamsError("teamId must be a string");
  }

  return changeTeamFlow(req.body, actorUser);
});
