import { restoreTeamFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { id } = req.params;
  const { actorUser } = req.data;
  await restoreTeamFlow(id, actorUser);
  return {};
});
