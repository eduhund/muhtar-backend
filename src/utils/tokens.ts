import crypto from "crypto";

import { apiKeysService } from "../services";
import { readFile, writeFile } from "./fs";

type tokenType = "user" | "membership" | "team";

export type Token = {
  userId?: string;
  membershipId?: string;
  teamId?: string;
  ts: number;
};

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment");
}

function rand() {
  return Math.random().toString(36).substring(2);
}

function createToken() {
  return rand() + rand();
}

const tokens = new Map<tokenType, Record<string, Token>>();

for (const type of ["user", "membership", "team"] as tokenType[]) {
  tokens.set(type, readFile("/temp/", `${type}Tokens.json`));
}

export async function checkApiKey(token: string) {
  const [id, key] = token.split(":");
  const existingKey = await apiKeysService.findApiKey(id);
  if (!existingKey || !existingKey.isActive() || !existingKey.verifyKey(key))
    return null;
  return existingKey;
}

export function checkAccessToken(type: tokenType, token: string): Token | null {
  const typeTokens = tokens.get(type);
  if (!typeTokens) return null;
  return typeTokens[token] || null;
}

export function setAccessToken(type: tokenType, id: string): string {
  const aceessToken = createToken();
  const typeTokens = tokens.get(type);
  if (!typeTokens) throw new Error("Token type not found");

  typeTokens[aceessToken] = {
    [`${type}Id`]: id,
    ts: Date.now(),
  };
  tokens.set(type, typeTokens);

  writeFile("/temp/", `${type}Tokens.json`, typeTokens);
  return aceessToken;
}

export function getBearerToken(header: string | undefined) {
  if (!header) return null;
  const matches = header.match(/Bearer (.+)/);
  if (!matches) return null;
  return matches[1];
}

export function signToken(payload: Record<string, any>): string {
  const header = { alg: "HS256" };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url",
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  const dataToSign = encodedHeader + "." + encodedPayload;
  const signature = crypto
    .createHmac("sha256", JWT_SECRET!)
    .update(dataToSign)
    .digest("base64url");

  return dataToSign + "." + signature;
}

export function verifyToken(token: string): Record<string, any> | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = encodedHeader + "." + encodedPayload;

  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET!)
    .update(dataToSign)
    .digest("base64url");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    )
  ) {
    return null;
  }

  try {
    const payloadStr = Buffer.from(encodedPayload, "base64url").toString(
      "utf8",
    );
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
}
