import { addTimeFlow } from "../../../flows";
import { errorHandler } from "../errorHandler";

export default async function addTime(req: any, res: any, next: any) {
  try {
    const { actorUser } = req.data;
    const { membershipId, teamId, projectId, taskId, date, duration, comment } =
      req.body;
    const data = await addTimeFlow(
      {
        membershipId,
        teamId,
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
    return next(errorHandler(e));
  }
}
