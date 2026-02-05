import { createWorkRoleFlow } from "../../../../flows";
import { withMembership } from "../utils";

export default withMembership(async (req) => {
  const { actorMembership } = req.data;
  const { name, description, baseRates } = req.body;

  if (!name) throw new Error("name is required");
  if (typeof name !== "string") throw new Error("name must be a string");
  if (description && typeof description !== "string")
    throw new Error("description must be a string");
  if (!baseRates) throw new Error("baseRates is required");
  if (!Array.isArray(baseRates)) throw new Error("baseRates must be an array");
  baseRates.forEach((baseRate) => {
    if (typeof baseRate !== "object")
      throw new Error("each baseRate must be an object");
    if (!baseRate.currency) throw new Error("baseRate.currency is required");
    if (typeof baseRate.currency !== "string")
      throw new Error("baseRate.currency must be a string");
    if (baseRate.amount === undefined || baseRate.amount === null)
      throw new Error("baseRate.amount is required");
    if (typeof baseRate.amount !== "number")
      throw new Error("baseRate.amount must be a number");
  });
  return createWorkRoleFlow({ name, description, baseRates }, actorMembership);
});
