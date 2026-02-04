import { updateTeamFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { id } = req.params;
  const { actorUser } = req.data;
  const { name } = req.body;
  await updateTeamFlow(
    id,
    {
      name,
    },
    actorUser,
  );
  return {};
});
