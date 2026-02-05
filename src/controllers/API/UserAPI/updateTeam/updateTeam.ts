import { updateTeamFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { actorUser } = req.data;
  const { id, name } = req.body;
  if (!id) throw new Error("id is required");
  if (typeof id !== "string") throw new Error("id must be a string");
  await updateTeamFlow(
    id,
    {
      name,
    },
    actorUser,
  );
  return {};
});
