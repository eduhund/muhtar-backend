import { resetBookedResourceFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { id } = req.body;

  if (!id) throw new InvalidParamsError("id is required");
  if (typeof id !== "string")
    throw new InvalidParamsError("id must be a string");

  return resetBookedResourceFlow(req.body, actorMembership);
});
