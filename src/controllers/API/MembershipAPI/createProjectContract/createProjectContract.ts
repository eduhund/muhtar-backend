import { createProjectContractFlow } from "../../../../flows";

export default async function createProjectContract(
  req: any,
  res: any,
  next: any
) {
  try {
    const { actorMembership } = req.data;
    const data = await createProjectContractFlow(req.body, actorMembership);
    return next({ data });
  } catch (e) {
    next(e);
  }
}
