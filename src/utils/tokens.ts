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

export function checkToken(token: string): Token | null {
  return tokens?.[token] || null;
}

export function setToken(userId: string): string {
  const aceessToken = createToken();
  tokens[aceessToken] = {
    userId,
    ts: Date.now(),
  };
  writeFile("/temp/", "tokens.json", tokens);
  return aceessToken;
}
