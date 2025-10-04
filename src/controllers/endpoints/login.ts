import { loginFlow } from "../../../flows";
import { errorHandler } from "../responses";

export default async function login(req: any, res: any, next: any) {
  try {
    const { email, password } = req.body;
    const accessToken = await loginFlow({ email, password });
    return next({ data: { accessToken } });
  } catch (e) {
    return next(errorHandler(e));
  }
}
