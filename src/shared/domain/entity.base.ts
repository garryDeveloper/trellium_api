export abstract class Entity<Id = string> {
  protected constructor(protected readonly _id: Id) {}

  get id(): Id {
    return this._id;
  }

  equals(other?: Entity<Id>): boolean {
    if (!other) return false;
    if (this === other) return true;
    return this._id === other._id;
  }
}
