import { changeTeamFlow } from "../../../../flows";

export default async function changeTeam(req: any, res: any, next: any) {
  try {
    const { actorUser } = req.data;
    const data = await changeTeamFlow(req.body, actorUser);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
