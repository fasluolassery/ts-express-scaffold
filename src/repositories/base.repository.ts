import { Document, Model, QueryFilter, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  find(filter: QueryFilter<T>): Promise<T[]>;
  findOne(filter: QueryFilter<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(item: any): Promise<T>;
  update(id: string, item: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
}

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async find(filter: QueryFilter<T>): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(item: any): Promise<T> {
    return this.model.create(item);
  }

  async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { returnDocument: 'after' }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
