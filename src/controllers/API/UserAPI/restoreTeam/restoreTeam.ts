import { restoreTeamFlow } from "../../../../flows";

export default async function restoreTeam(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    await restoreTeamFlow(id, currentUser);
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
