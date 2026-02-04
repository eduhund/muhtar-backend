import { createWorkRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { name, description, baseRate } = req.body;

  if (!name) throw new Error("name is required");
  if (typeof name !== "string") throw new Error("name must be a string");
  if (description && typeof description !== "string")
    throw new Error("description must be a string");
  if (!baseRate) throw new Error("baseRate is required");
  if (typeof baseRate !== "object")
    throw new Error("baseRate must be an object");
  if (!baseRate.currency) throw new Error("baseRate.currency is required");
  if (typeof baseRate.currency !== "string")
    throw new Error("baseRate.currency must be a string");
  if (baseRate.amount === undefined || baseRate.amount === null)
    throw new Error("baseRate.amount is required");
  if (typeof baseRate.amount !== "number")
    throw new Error("baseRate.amount must be a number");

  return createWorkRoleFlow({ name, description, baseRate }, actorMembership);
});
