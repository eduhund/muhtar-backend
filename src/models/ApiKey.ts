import BaseModel from "./BaseModel";
import { compareHash } from "../utils/hash";
import Membership from "./Membership";

export type ApiKeyParams = {
  _id: string;
  hash: string;
  salt: string;
  userId?: string | null;
  membershipId?: string | null;
  teamId?: string | null;
  serviceId?: string | null;
  scopes?: string[];
  createdAt?: Date;
  creationType?: string;
  expiresAt?: Date | null;
  revokedAt?: Date | null;
};

export default class ApiKey extends BaseModel<ApiKey, Membership> {
  hash: string;
  salt: string;
  userId: string | null;
  membershipId: string | null;
  teamId: string | null;
  serviceId: string | null;
  scopes: string[];
  createdAt: Date;
  creationType: string;
  expiresAt: Date | null;
  revokedAt: Date | null;
  constructor(data: any = {}) {
    super(data._id);
    this.hash = data.hash;
    this.salt = data.salt;
    this.userId = data.userId ?? null;
    this.membershipId = data.membershipId ?? null;
    this.teamId = data.teamId ?? null;
    this.serviceId = data.serviceId ?? null;
    this.scopes = data.scopes ?? [];
    this.createdAt = data.createdAt ?? new Date();
    this.creationType = data.creationType ?? "auto";
    this.expiresAt = data.expiresAt ?? null;
    this.revokedAt = data.revokedAt ?? null;
  }

  isRevoked() {
    return this.revokedAt !== null;
  }

  isExpired() {
    if (this.expiresAt === null) {
      return false;
    }
    return new Date() > this.expiresAt;
  }

  isActive() {
    return !this.isRevoked() && !this.isExpired();
  }

  async verifyKey(key: string) {
    return compareHash(key, this.hash, this.salt);
  }
}
