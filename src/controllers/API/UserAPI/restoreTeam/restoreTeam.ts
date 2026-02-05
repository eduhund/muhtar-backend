import { restoreTeamFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { actorUser } = req.data;
  const { id } = req.body;

  if (!id) throw new Error("id is required");
  if (typeof id !== "string") throw new Error("id must be a string");

  await restoreTeamFlow(id, actorUser);
  return {};
});
