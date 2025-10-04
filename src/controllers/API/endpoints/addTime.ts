import { addTimeFlow } from "../../../flows";

export default async function addTime(req: any, res: any, next: any) {
  try {
    const { actorUser } = req.data;
    const { membershipId, projectId, taskId, date, duration, comment } =
      req.body;
    const data = await addTimeFlow(
      {
        membershipId,
        projectId,
        taskId,
        date: new Date(date),
        duration,
        comment,
      },
      actorUser
    );
    return next({ data });
  } catch (e) {
    next(e);
  }
}
