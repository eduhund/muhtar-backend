import { apiKeysService } from "../services";
import { readFile, writeFile } from "./fs";

type tokenType = "user" | "membership" | "team";

export type Token = {
  userId?: string;
  membershipId?: string;
  teamId?: string;
  ts: number;
};

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
