import { updateTeamFlow } from "../../../../flows";

export default async function update(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { name } = req.body;
    await updateTeamFlow(
      id,
      {
        name,
      },
      currentUser
    );
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
