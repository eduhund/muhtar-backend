import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hash(data: any) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}

export async function compare(inputData: any, storedHash: any) {
  return await bcrypt.compare(inputData, storedHash);
}
