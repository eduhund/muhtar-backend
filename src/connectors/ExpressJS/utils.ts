import { Response } from "express";
import log from "../../utils/log";

type ResponseMessageType = {
  data: Record<string, any> | null;
  error?: Record<string, any>;
};

export function handleResponse(
  message: ResponseMessageType,
  req: any,
  res: Response,
  next: any
) {
  const { data, error } = message;
  if (data) {
    res.status(200).send({ OK: true, data });
    return;
  }

  switch (error?.type) {
    case "BUSSINESS":
      delete error.type;
      log.warn(error);
      res.status(400).send({ OK: false, error });
      return;

    case "SYSTEM":
      delete error.type;
      log.error(error);
      res.status(500).send({ OK: false, error });
      return;

    default:
      log.error({ type: "UNKNOWN", message });
      res.status(500).send({ OK: false });
  }
}

export function handlePath(req: any, res: any, next: any) {
  log.info("Empty path", { url: req.url });
  res.sendStatus(404);
}
