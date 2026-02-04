import { changeTeamFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { actorUser } = req.data;
  return changeTeamFlow(req.body, actorUser);
});
