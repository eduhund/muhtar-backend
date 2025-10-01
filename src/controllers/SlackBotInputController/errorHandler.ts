import Rejection from "../../utils/Rejection";

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
