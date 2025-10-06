import { getTimeListFlow } from "../../../flows";

export default async function getTimeList(req: any, res: any, next: any) {
  try {
    const { actorMembership } = req.data;
    const { projectId, membershipId, date, from, to, withDeleted } = req.query;

    const data = await getTimeListFlow(
      { projectId, membershipId, date, from, to, withDeleted },
      actorMembership
    );
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
