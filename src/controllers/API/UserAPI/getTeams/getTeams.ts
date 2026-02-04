import { getTeamsFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { actorUser } = req.data;
  return getTeamsFlow(actorUser);
});
