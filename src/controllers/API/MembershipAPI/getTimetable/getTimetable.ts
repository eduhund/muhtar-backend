import { getTimetableFlow } from "../../../../flows";

export default async function getTimetable(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const data = await getTimetableFlow(req.query, actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
