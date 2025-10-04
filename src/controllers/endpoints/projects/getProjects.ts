import { getProjectsFlow } from "../../../../flows";
import { errorHandler } from "../../responses";

export default async function getProjects(req: any, res: any, next: any) {
  try {
    const { currentUser } = req.data;
    const { teamId, membershipId, status } = req.query;
    const data = await getProjectsFlow(
      { teamId, membershipId, status },
      currentUser
    );
    return next({ data });
  } catch (e) {
    return next(errorHandler(e));
  }
}
