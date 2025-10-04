import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hash(data: string) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(data, salt);
  return { hash, salt };
}

export async function compare(
  inputData: string,
  storedHash: string,
  storedSalt: string
) {
  const saltedInput = await bcrypt.hash(inputData, storedSalt);
  return await bcrypt.compare(saltedInput, storedHash);
}
