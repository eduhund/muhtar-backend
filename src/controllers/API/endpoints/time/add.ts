import { addTimeFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function addTime(req: any, res: any, next: any) {
  try {
    const { currentUser } = req.data;
    const {
      membershipId,
      teamId,
      projectId,
      subproject,
      date,
      duration,
      comment,
    } = req.body;
    const data = await addTimeFlow(
      {
        membershipId,
        teamId,
        projectId,
        subproject,
        date,
        duration,
        comment,
      },
      currentUser
    );
    return next({ data });
  } catch (e) {
    return next(errorHandler(e));
  }
}
