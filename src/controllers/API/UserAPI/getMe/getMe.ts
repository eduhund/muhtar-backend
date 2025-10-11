import { getMeFlow } from "../../../../flows";

export default async function getMe(req: any, res: any, next: any) {
  try {
    const { actorUser } = req.data;
    const data = await getMeFlow(actorUser);
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
