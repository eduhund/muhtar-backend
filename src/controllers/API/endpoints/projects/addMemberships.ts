import { addMembershipsFlow } from "../../../../flows";

export default async function addMemberships(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { memberships = [] } = req.body;
    await addMembershipsFlow(
      id,
      {
        memberships,
      },
      currentUser
    );
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
