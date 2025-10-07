import { updateProjectFlow } from "../../../../flows";

export default async function update(req: any, res: any, next: any) {
  try {
    const { id } = req.params;
    const { currentUser } = req.data;
    const { name, description, plan } = req.body;
    await updateProjectFlow(
      id,
      {
        name,
        description,
        plan,
      },
      currentUser
    );
    return next({ data: {} });
  } catch (e) {
    return next(e);
  }
}
