import ApiKey from "./ApiKey";
import Membership from "./Membership";
import Project from "./Project";
import ProjectContract from "./ProjectContract";
import ProjectPlan from "./ProjectPlan";
import Task from "./Task";
import Team from "./Team";
import Resource from "./Resource";
import User from "./User";
import WorkRole from "./WorkRole";
import BookedResource from "./BookedResource";

type ModelType =
  | User
  | Membership
  | Task
  | Resource
  | Team
  | Project
  | ProjectContract
  | ProjectPlan
  | ApiKey
  | WorkRole
  | BookedResource;
type ActorType = User | Membership;

type ChangesObject<T> = {
  [K in keyof T]?: { from: T[K] | null; to: T[K] | null };
};

type BinaryID = { _bsontype: string; sub_type: number; buffer: any };

type ModelJSON<T> = { id: BinaryID } & Partial<T>;

function cleanData<T>(data: Partial<T>): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}

function createChanges<T extends ModelType>(
  oldData: T,
  newData: Partial<T>,
): ChangesObject<T> {
  const changes: ChangesObject<T> = {};
  for (const key of Object.keys(newData) as (keyof T)[]) {
    if (oldData[key] !== newData[key]) {
      changes[key] = { from: oldData[key] ?? null, to: newData[key] ?? null };
    }
  }
  return changes;
}

function binaryUuidToString(binaryUuid: BinaryID): string {
  if (
    !binaryUuid ||
    binaryUuid._bsontype !== "Binary" ||
    binaryUuid.sub_type !== 4
  ) {
    throw new Error("Input is not a Binary UUID");
  }
  const buf = binaryUuid.buffer;
  const hex = [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}

export default class BaseModel<T extends ModelType, H extends ActorType> {
  private _id: BinaryID;
  isDeleted: boolean = false;
  history: Array<{
    ts: number;
    action: "create" | "update" | "archive" | "restore";
    actorId: string;
    actorType?: "user" | "membership" | "AUTO";
    changes?: ChangesObject<T>;
  }> = [];
  constructor(_id: BinaryID) {
    this._id = _id;
  }

  _update(newData: Partial<T>, actor: H) {
    const cleanedData = cleanData(newData);
    Object.assign(this, cleanedData);

    const changes = createChanges(this as unknown as T, cleanedData);

    this.history.push({
      ts: Date.now(),
      action: "update",
      actorId: actor.getId(),
      changes: changes,
    });
    return this;
  }

  _systemUpdate(newData: Partial<T>) {
    const cleanedData = cleanData(newData);
    Object.assign(this, cleanedData);
    return this;
  }

  _archive(actor: User | Membership) {
    if (this.isDeleted) return;
    this.isDeleted = true;
    this.history.push({
      ts: Date.now(),
      action: "archive",
      actorId: actor.getId(),
    });
  }

  _restore(actor: User | Membership) {
    if (!this.isDeleted) return;
    this.isDeleted = false;
    this.history.push({
      ts: Date.now(),
      action: "restore",
      actorId: actor.getId(),
    });
  }

  getId() {
    return binaryUuidToString(this._id);
  }

  toJSON() {
    const result: any = { id: this._id };
    const data = this as unknown as T;
    for (const key of Object.keys(data)) {
      const typedKey = key as keyof T;
      if (!key.startsWith("_") && typeof data[typedKey] !== "function") {
        result[key] = data[typedKey];
      }
    }
    return result as ModelJSON<T>;
  }
}
