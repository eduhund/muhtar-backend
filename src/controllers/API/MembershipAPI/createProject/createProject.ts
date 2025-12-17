import { createProjectFlow } from "../../../../flows";

export default async function createProject(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await createProjectFlow(req.body, actorMembership);
    return next({ data });
  } catch (e) {
    next(e);
  }
}
