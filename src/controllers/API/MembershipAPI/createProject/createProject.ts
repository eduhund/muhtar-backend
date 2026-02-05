import { createProjectFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { name, description } = req.body;

  if (!name) throw new InvalidParamsError("name is required");
  if (typeof name !== "string")
    throw new InvalidParamsError("name must be a string");

  if (description && typeof description !== "string")
    throw new InvalidParamsError("description must be a string");

  return createProjectFlow({ name, description }, actorMembership);
});
