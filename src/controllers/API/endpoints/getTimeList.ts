import { getTimeListFlow } from "../../../flows";
import BussinessError from "../../../utils/Rejection";

export default async function getTimeList(req: any, res: any, next: any) {
  try {
    const { currentUser } = req.data;
    const { teamId, projectId, membershipId, date, from, to, withDeleted } =
      req.query;

    if (!teamId) {
      throw new BussinessError("BAD_REQUEST", "Team ID is required");
    }

    const data = await getTimeListFlow(
      { teamId, projectId, membershipId, date, from, to, withDeleted },
      currentUser
    );
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
