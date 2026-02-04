import { declineInvitationFlow } from "../../../../flows";
import { withUser } from "../utils";

export default withUser(async (req) => {
  const { teamId } = req.body;
  const { actorUser } = req.data;
  return declineInvitationFlow({ teamId }, actorUser);
});
