import { getBookedResourcesFlow } from "../../../../flows";

export default async function getBookedResources(
  req: any,
  res: any,
  next: any,
) {
  try {
    const { actorMembership } = req.data;
    const data = await getBookedResourcesFlow(actorMembership);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
