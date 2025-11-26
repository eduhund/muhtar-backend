import { createProjectPlanFlow } from "../../../../flows";

export default async function createProjectPlan(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await createProjectPlanFlow(req.body, actorMembership);
    return next({ data });
  } catch (e) {
    next(e);
  }
}
