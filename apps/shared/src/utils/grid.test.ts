import { describe, expect, it } from 'vitest';
import {
  indexToCoord,
  coordToIndex,
  getAdjacentTileIndices,
  getManhattanDistance,
  calculateClusterBonus,
} from './grid';

describe('Grid Math Utilities', () => {
  it('correctly maps between 1D index and 2D coordinates', () => {
    expect(indexToCoord(0)).toEqual({ x: 0, y: 0 });
    expect(indexToCoord(19)).toEqual({ x: 19, y: 0 });
    expect(indexToCoord(20)).toEqual({ x: 0, y: 1 });
    expect(indexToCoord(399)).toEqual({ x: 19, y: 19 });

    expect(coordToIndex(0, 0)).toBe(0);
    expect(coordToIndex(19, 0)).toBe(19);
    expect(coordToIndex(0, 1)).toBe(20);
    expect(coordToIndex(19, 19)).toBe(399);
  });

  it('determines orthogonal neighbors and boundaries correctly', () => {
    // Top-left corner (0, 0)
    const cornerNeighbors = getAdjacentTileIndices(0);
    expect(cornerNeighbors).toContain(1); // right
    expect(cornerNeighbors).toContain(20); // down
    expect(cornerNeighbors.length).toBe(2);

    // Center tile (1, 1) = index 21
    const centerNeighbors = getAdjacentTileIndices(21);
    expect(centerNeighbors.length).toBe(4);
    expect(centerNeighbors).toEqual(expect.arrayContaining([1, 41, 20, 22]));
  });

  it('calculates Manhattan distance and cluster bonuses', () => {
    // (0, 0) to (3, 4) -> distance = 3 + 4 = 7
    const idxA = coordToIndex(0, 0);
    const idxB = coordToIndex(3, 4);
    expect(getManhattanDistance(idxA, idxB)).toBe(7);

    // Adjacent tiles: 0 and 1 -> 1 edge -> +5% bonus = 1.05
    expect(calculateClusterBonus([0, 1])).toBe(1.05);
    // Non-adjacent tiles: 0 and 100 -> 0 edges -> 1.0
    expect(calculateClusterBonus([0, 100])).toBe(1.0);
  });
});
