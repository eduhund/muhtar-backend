import { createTeamFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { actorUser } = req.data;
  const { name } = req.body;

  if (!name) {
    throw new InvalidParamsError("name is required");
  }
  if (typeof name !== "string") {
    throw new InvalidParamsError("name must be a string");
  }

  return createTeamFlow({ name }, actorUser);
});
