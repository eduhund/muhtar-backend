import { createTeamFlow } from "../../../../flows";

export default async function createTeam(req: any, res: any, next: any) {
  try {
    const { name } = req.body;
    const { actorUser } = req.data;
    const data = await createTeamFlow({ name }, actorUser);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
