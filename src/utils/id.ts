import { v7 as uuidv7, parse as uuidParse } from "uuid";
import { Binary } from "mongodb";

export function getBinaryUUID(uuid: string | null = null) {
  const uuidStr = uuid || uuidv7();
  const uuidBuffer = Buffer.from(uuidParse(uuidStr));
  return new Binary(uuidBuffer, Binary.SUBTYPE_UUID);
}
