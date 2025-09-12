import log from "../../utils/log";

export function handlePath(req: any, res: any, next: any) {
  log.info("Empty path", { url: req.url });
  res.sendStatus(404);
}
