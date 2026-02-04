import { getResourceFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { id } = req.query;

  if (typeof id !== "string") {
    throw new InvalidParamsError("id must be a string");
  }

  return getResourceFlow({ id }, actorMembership);
});
