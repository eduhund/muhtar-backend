import crypto from "crypto";

function generateHash(data: string) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

export function createHash(data: string) {
  const salt = generateSalt();
  const dataToHash = salt + data;
  const hash = generateHash(dataToHash);
  return { hash, salt };
}

export function compareHash(
  inputData: string,
  storedHash: string,
  storedSalt: string,
) {
  const saltedInput = storedSalt + inputData;
  return storedHash === generateHash(saltedInput);
}

export function createHashWithoutSalt(data: string) {
  return generateHash(data);
}

export function compareHashWithoutSalt(inputData: string, storedHash: string) {
  return storedHash === generateHash(inputData);
}
