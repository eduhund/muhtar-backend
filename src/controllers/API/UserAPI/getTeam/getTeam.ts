import { getTeamFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { actorUser } = req.data;
  const { id } = req.query;

  if (!id) throw new Error("id is required");
  if (typeof id !== "string") throw new Error("id must be a string");

  return getTeamFlow(id, actorUser);
});
