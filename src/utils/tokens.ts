import { apiKeys } from "../services";
import { readFile, writeFile } from "./fs";

export type Token = {
  userId: string;
  ts: number;
};

function rand() {
  return Math.random().toString(36).substring(2);
}

function createToken() {
  return rand() + rand();
}

const tokens = readFile("/temp/", "tokens.json") || {};

export async function checkApiKey(token: string) {
  const [id, key] = token.split(".");
  const existingKey = await apiKeys.findApiKey(id);
  if (!existingKey || !existingKey.isActive()) return false;
  return existingKey.verifyKey(key);
}

export function checkAccessToken(token: string): Token | null {
  return tokens?.[token] || null;
}

export function setAccessToken(userId: string): string {
  const aceessToken = createToken();
  tokens[aceessToken] = {
    userId,
    ts: Date.now(),
  };
  writeFile("/temp/", "tokens.json", tokens);
  return aceessToken;
}

export function getBearerToken(header: string | undefined) {
  if (!header) return null;
  const matches = header.match(/Bearer (.+)/);
  if (!matches) return null;
  return matches[1];
}
