import { Response } from "express";
import log from "../../utils/log";
import Rejection from "../../utils/Rejection";

type ResponseMessageType = {
  data: Record<string, any> | null;
  error?: Record<string, any>;
};

export function errorHandler(e: any) {
  if (e instanceof Rejection) {
    const { code, message, details } = e;
    return {
      error: {
        type: "BUSSINESS",
        code,
        message,
        details,
      },
    };
  }
  return { error: { type: "SYSTEM", trace: e } };
}

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
