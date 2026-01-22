import { registerFlow } from "../../../../flows";

export default async function register(req: any, res: any, next: any) {
  try {
    const { email, password, firstName, lastName } = req.body;
    const data = await registerFlow({ email, password, firstName, lastName });
    return next({ data });
  } catch (e) {
    return next(e);
  }
}
