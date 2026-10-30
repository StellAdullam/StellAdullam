import { createHash } from 'crypto';

/**
 * Computes SHA-256 hash of a string or buffer and returns hex representation.
 */
export function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Combines two child hashes in a deterministic sorted order (anti-frontrunning).
 */
export function combineHash(a: string, b: string): string {
  return a < b ? sha256(a + b) : sha256(b + a);
}

/**
 * Standard Merkle Tree implementation for decentralized dividend distributions and claims.
 */
export class MerkleTree {
  private leaves: string[];
  private layers: string[][];

  constructor(leaves: string[]) {
    if (leaves.length === 0) {
      throw new Error('Cannot construct Merkle tree with zero leaves');
    }
    this.leaves = leaves.map((leaf) => (leaf.length === 64 ? leaf : sha256(leaf)));
    this.layers = [this.leaves];
    this.buildTree();
  }

  private buildTree(): void {
    let currentLayer = this.layers[0];

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        if (i + 1 < currentLayer.length) {
          nextLayer.push(combineHash(currentLayer[i], currentLayer[i + 1]));
        } else {
          // Odd leaf: propagate up
          nextLayer.push(currentLayer[i]);
        }
      }
      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  /**
   * Returns the root hash of the Merkle tree.
   */
  public getRoot(): string {
    return this.layers[this.layers.length - 1][0];
  }

  /**
   * Generates a cryptographic Merkle proof for a given leaf.
   */
  public getProof(leaf: string): string[] {
    const hashedLeaf = leaf.length === 64 ? leaf : sha256(leaf);
    let index = this.layers[0].indexOf(hashedLeaf);

    if (index === -1) {
      throw new Error('Leaf not found in Merkle tree');
    }

    const proof: string[] = [];

    for (let i = 0; i < this.layers.length - 1; i++) {
      const currentLayer = this.layers[i];
      const isRightNode = index % 2 === 1;
      const siblingIndex = isRightNode ? index - 1 : index + 1;

      if (siblingIndex < currentLayer.length) {
        proof.push(currentLayer[siblingIndex]);
      }

      index = Math.floor(index / 2);
    }

    return proof;
  }

  /**
   * Statically verifies a Merkle proof against a known root hash.
   */
  public static verify(leaf: string, proof: string[], root: string): boolean {
    let current = leaf.length === 64 ? leaf : sha256(leaf);

    for (const sibling of proof) {
      current = combineHash(current, sibling);
    }

    return current === root;
  }
}
