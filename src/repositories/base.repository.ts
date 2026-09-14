import {
  Document,
  Model,
  QueryFilter,
  UpdateQuery,
  AnyKeys,
  AnyObject,
  PopulateOptions,
} from 'mongoose';
import { PaginationMeta } from '../utils';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1 | 'asc' | 'desc'> | string;
  select?: string | Record<string, number | boolean>;
  populate?: PopulateOptions | PopulateOptions[] | string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async find(filter: QueryFilter<T> = {} as QueryFilter<T>): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async create(item: AnyKeys<T> & AnyObject): Promise<T> {
    return this.model.create(item);
  }

  async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { returnDocument: 'after' }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async findPaginated(
    filter: QueryFilter<T> = {} as QueryFilter<T>,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    const page = options.page && Number(options.page) > 0 ? Math.floor(Number(options.page)) : 1;
    const limit =
      options.limit && Number(options.limit) > 0 ? Math.floor(Number(options.limit)) : 10;
    const skip = (page - 1) * limit;

    const query = this.model.find(filter).skip(skip).limit(limit);

    if (options.sort) {
      query.sort(options.sort as string | Record<string, 1 | -1 | 'asc' | 'desc'>);
    }

    if (options.select) {
      query.select(options.select as Parameters<typeof query.select>[0]);
    }

    if (options.populate) {
      query.populate(options.populate as Parameters<typeof query.populate>[0]);
    }

    const [data, totalItems] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }
}
