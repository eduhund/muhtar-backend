import { updateTimeFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function updateTime(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { membershipId, projectId, subproject, date, duration, comment } =
      req.body;
    await updateTimeFlow(
      id,
      {
        membershipId,
        projectId,
        subproject,
        date,
        duration,
        comment,
      },
      currentUser
    );
    return next({ data: {} });
  } catch (e) {
    return next(errorHandler(e));
  }
}
