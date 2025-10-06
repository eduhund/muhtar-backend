import { getTimeListFlow } from "../../../flows";
import BusinessError from "../../../utils/Rejection";

export default async function getTimeList(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { projectId, membershipId, date, from, to, withDeleted } = req.query;

    if (!date && !(from && to)) {
      throw new BusinessError(
        "INVALID_PARAMETERS",
        "You must provide either 'date' or both 'from' and 'to' parameters"
      );
    }

    const data = await getTimeListFlow(
      { projectId, membershipId, date, from, to, withDeleted },
      actorMembership
    );
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
