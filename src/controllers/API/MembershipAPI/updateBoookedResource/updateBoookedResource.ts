import { updateBoookedResourceFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { id, value } = req.body;

  if (!id) throw new InvalidParamsError("id is required");
  if (typeof id !== "string")
    throw new InvalidParamsError("id must be a string");

  if (typeof value !== "number")
    throw new InvalidParamsError("value must be a number");

  return updateBoookedResourceFlow(req.body, actorMembership);
});
