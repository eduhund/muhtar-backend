import { inviteUsersFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { invitees } = req.body;
  return inviteUsersFlow({ invitees }, actorMembership);
});
