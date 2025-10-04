import { Response } from "express";
import log from "../../utils/log";

export function handleResponse(
  message: any,
  req: any,
  res: Response,
  next: any
) {
  if (!message) return next();

  if (message.data) {
    res.status(200).send({ OK: true, data: message.data });
    return;
  }

  const error = message.error || message;

  switch (error?.type) {
    case "BUSSINESS":
      delete error.type;
      log.warn(error);
      res.status(400).send({ OK: false, error });
      return;

    default:
      log.error({ type: "SYSTEM", error });
      res
        .status(500)
        .send({ OK: false, error: { message: "Internal Server Error" } });
  }
}

export function handlePath(req: any, res: any, next: any) {
  log.info("Empty path", { url: req.url });
  res.sendStatus(404);
}
