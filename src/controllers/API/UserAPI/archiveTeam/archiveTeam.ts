import { archiveTeamFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { id } = req.params;
  const { actorUser } = req.data;
  await archiveTeamFlow(id, actorUser);
  return {};
});
