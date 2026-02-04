import { createTeamFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { name } = req.body;
  const { actorUser } = req.data;
  return createTeamFlow({ name }, actorUser);
});
