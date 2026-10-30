export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;
export const TOTAL_GRID_TILES = GRID_WIDTH * GRID_HEIGHT; // 400

export interface GridCoordinate {
  x: number;
  y: number;
}

/**
 * Converts a 1D tile index (0 to 399) into 2D (x, y) coordinates.
 */
export function indexToCoord(index: number): GridCoordinate {
  if (index < 0 || index >= TOTAL_GRID_TILES) {
    throw new Error(`Tile index ${index} out of bounds [0, ${TOTAL_GRID_TILES - 1}]`);
  }
  return {
    x: index % GRID_WIDTH,
    y: Math.floor(index / GRID_WIDTH),
  };
}

/**
 * Converts 2D (x, y) coordinates into a 1D tile index (0 to 399).
 */
export function coordToIndex(x: number, y: number): number {
  if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) {
    throw new Error(`Coordinates (${x}, ${y}) out of grid bounds 20x20`);
  }
  return y * GRID_WIDTH + x;
}

/**
 * Returns orthogonal neighboring tile indices (up, down, left, right).
 */
export function getAdjacentTileIndices(index: number): number[] {
  const { x, y } = indexToCoord(index);
  const neighbors: number[] = [];

  // Up
  if (y > 0) neighbors.push(coordToIndex(x, y - 1));
  // Down
  if (y < GRID_HEIGHT - 1) neighbors.push(coordToIndex(x, y + 1));
  // Left
  if (x > 0) neighbors.push(coordToIndex(x - 1, y));
  // Right
  if (x < GRID_WIDTH - 1) neighbors.push(coordToIndex(x + 1, y));

  return neighbors;
}

/**
 * Computes the Manhattan distance between two tile indices.
 */
export function getManhattanDistance(indexA: number, indexB: number): number {
  const a = indexToCoord(indexA);
  const b = indexToCoord(indexB);
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Computes the cluster bonus multiplier based on adjacent contiguous owned tiles.
 * Base multiplier is 1.0. Each adjacent owned neighbor adds a 5% bonus.
 */
export function calculateClusterBonus(ownedTileIndices: number[]): number {
  if (ownedTileIndices.length <= 1) return 1.0;

  const ownedSet = new Set(ownedTileIndices);
  let totalAdjacencyCount = 0;

  for (const idx of ownedTileIndices) {
    const neighbors = getAdjacentTileIndices(idx);
    for (const n of neighbors) {
      if (ownedSet.has(n)) {
        totalAdjacencyCount++;
      }
    }
  }

  // Each edge counted twice
  const adjacentEdges = totalAdjacencyCount / 2;
  const bonus = 1.0 + adjacentEdges * 0.05;
  return Number(bonus.toFixed(2));
}
