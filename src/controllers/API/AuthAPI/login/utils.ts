import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateloginParams(req: any, res: any, next: any) {
  const { email, password } = req.query;
  if (!email || !password) {
    throw new InvalidParamsError(
      "Both 'email' and 'password' parameters must be provided"
    );
  }
  if (typeof email !== "string") {
    throw new InvalidParamsError("email must be a string");
  }
  if (typeof password !== "string") {
    throw new InvalidParamsError("password must be a string");
  }
  return next();
}
