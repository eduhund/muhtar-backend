import Membership from "./Membership";
import Project from "./Project";
import Team from "./Team";
import Time from "./Time";
import User from "./User";

type ModelType = User | Membership | Time | Team | Project;
type ActorType = User | Membership;

type ChangesObject<T> = {
  [K in keyof T]?: { from: T[K] | null; to: T[K] | null };
};

export default class BaseModel<T extends ModelType, H extends ActorType> {
  private _id: string;
  isDeleted: boolean = false;
  history: Array<{
    ts: number;
    action: "create" | "update" | "archive" | "restore";
    actorId: string;
    changes?: ChangesObject<T>;
  }> = [];
  constructor(_id: string) {
    this._id = _id;
  }

  _update(newData: Partial<T>, actor: H) {
    const cleanData = Object.fromEntries(
      Object.entries(newData).filter(([_, value]) => value !== undefined)
    ) as Partial<T>;
    const changes: ChangesObject<T> = {};

    for (const key in cleanData) {
      const typedKey = key as keyof T;
      const oldVal = this[typedKey];
      const newVal = cleanData[typedKey];

      if (oldVal === newVal) continue;

      changes[typedKey] = {
        from: oldVal ?? null,
        to: newVal ?? null,
      };
    }

    Object.assign(this, cleanData);

    this.history.push({
      ts: Date.now(),
      action: "update",
      actorId: actor.getId(),
      changes: changes,
    });
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
    return this._id;
  }

  toJSON() {
    const result: Record<string, any> = {};
    for (const key of Object.keys(this)) {
      if (!key.startsWith("_") && typeof this[key] !== "function") {
        result[key] = this[key];
      }
    }
    result.id = this._id;
    return result;
  }
}
