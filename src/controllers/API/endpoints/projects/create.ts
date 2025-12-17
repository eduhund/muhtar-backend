import { createProjectFlow } from "../../../../flows";

export default async function create(req: any, res: any, next: any) {
  try {
    const { currentUser } = req.data;
    const { name, description } = req.body;
    const data = await createProjectFlow({ name, description }, currentUser);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
