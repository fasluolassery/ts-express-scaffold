import { describe, it, expect, beforeEach } from '@jest/globals';
import mongoose, { Schema, Document } from 'mongoose';
import { BaseRepository } from '../../src/repositories/base.repository';

interface ITestItem extends Document {
  name: string;
  score: number;
  isActive: boolean;
}

const testItemSchema = new Schema<ITestItem>(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TestItemModel =
  mongoose.models.TestItem || mongoose.model<ITestItem>('TestItem', testItemSchema);

class TestItemRepository extends BaseRepository<ITestItem> {
  constructor() {
    super(TestItemModel);
  }
}

describe('BaseRepository Pagination Integration Suite', () => {
  const repository = new TestItemRepository();

  beforeEach(async () => {
    // Seed 25 items with varying scores
    const items = Array.from({ length: 25 }, (_, i) => ({
      name: `Item ${String(i + 1).padStart(2, '0')}`,
      score: (i + 1) * 10,
      isActive: i % 2 === 0, // 13 active, 12 inactive
    }));

    await TestItemModel.insertMany(items);
  });

  it('should return the first page with default limit of 10 items', async () => {
    const result = await repository.findPaginated();

    expect(result.data).toHaveLength(10);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      totalItems: 25,
      totalPages: 3,
    });
  });

  it('should correctly handle page 2 with custom limit of 5 items', async () => {
    const result = await repository.findPaginated({}, { page: 2, limit: 5 });

    expect(result.data).toHaveLength(5);
    expect(result.pagination).toEqual({
      page: 2,
      limit: 5,
      totalItems: 25,
      totalPages: 5,
    });
  });

  it('should correctly sort results by score descending', async () => {
    const result = await repository.findPaginated({}, { page: 1, limit: 5, sort: { score: -1 } });

    expect(result.data).toHaveLength(5);
    expect(result.data[0].score).toBe(250); // highest score
    expect(result.data[1].score).toBe(240);
  });

  it('should filter items and calculate correct pagination for filtered results', async () => {
    // 13 active items total
    const result = await repository.findPaginated({ isActive: true }, { page: 1, limit: 10 });

    expect(result.data).toHaveLength(10);
    expect(result.pagination.totalItems).toBe(13);
    expect(result.pagination.totalPages).toBe(2);
    expect(result.data.every((item) => item.isActive)).toBe(true);
  });

  it('should select only specified fields when projection is provided', async () => {
    const result = await repository.findPaginated({}, { page: 1, limit: 3, select: 'name' });

    expect(result.data).toHaveLength(3);
    expect(result.data[0].name).toBeDefined();
    // score should not be included when select is 'name'
    expect(result.data[0].score).toBeUndefined();
  });

  it('should return an empty array with totalPages 1 when no documents match', async () => {
    const result = await repository.findPaginated({ name: 'Nonexistent' });

    expect(result.data).toEqual([]);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
    });
  });

  it('should sanitize negative or invalid page numbers to default 1', async () => {
    const result = await repository.findPaginated({}, { page: -5, limit: -20 });

    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
  });
});
