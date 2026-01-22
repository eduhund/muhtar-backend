import { InvalidParamsError } from "../../../../utils/Rejection";

export default function validateRegisterParams(req: any, res: any, next: any) {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    throw new InvalidParamsError(
      "Both 'email' and 'password' parameters must be provided",
    );
  }
  if (typeof email !== "string") {
    throw new InvalidParamsError("email must be a string");
  }
  if (!email.includes("@")) {
    throw new InvalidParamsError("email must be a valid email address");
  }
  if (typeof password !== "string") {
    throw new InvalidParamsError("password must be a string");
  }
  if (!firstName) {
    throw new InvalidParamsError("Parameter 'firstName' must be provided");
  }
  if (firstName && typeof firstName !== "string") {
    throw new InvalidParamsError("firstName must be a string");
  }
  if (lastName && typeof lastName !== "string") {
    throw new InvalidParamsError("lastName must be a string");
  }
  return next();
}
