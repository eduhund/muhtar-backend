import { createProjectPlanFlow } from "../../../../flows";
import { InvalidParamsError } from "../../../../utils/Rejection";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;

  const { projectId } = req.body;
  if (!projectId) throw new InvalidParamsError("projectId is required");
  if (typeof projectId !== "string" && projectId !== null)
    throw new InvalidParamsError("projectId must be a string or null");

  return createProjectPlanFlow(req.body, actorMembership);
});
