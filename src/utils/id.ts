import { parse as uuidParse } from "uuid";
import { Binary } from "mongodb";

export function getBinaryUUID(uuid: string) {
  const uuidBuffer = Buffer.from(uuidParse(uuid));
  return new Binary(uuidBuffer, Binary.SUBTYPE_UUID);
}
