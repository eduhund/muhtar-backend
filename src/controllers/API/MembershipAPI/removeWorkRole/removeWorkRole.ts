import { removeWorkRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { id } = req.body;
  //TODO: validate id
  return removeWorkRoleFlow({ id }, actorMembership);
});
