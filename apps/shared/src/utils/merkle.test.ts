import { describe, expect, it } from "vitest";
import { MerkleTree, sha256 } from "./merkle";

describe("MerkleTree", () => {
  it("builds tree and generates valid verification proofs", () => {
    const claims = [
      "GABC1:100_USDC",
      "GDEF2:250_USDC",
      "GGHI3:500_USDC",
      "GJKL4:75_USDC",
    ];

    const tree = new MerkleTree(claims);
    const root = tree.getRoot();
    expect(root).toBeDefined();
    expect(root.length).toBe(64);

    // Verify proof for first claim
    const targetClaim = claims[0];
    const proof = tree.getProof(targetClaim);
    expect(proof.length).toBeGreaterThan(0);

    const isValid = MerkleTree.verify(targetClaim, proof, root);
    expect(isValid).toBe(true);

    // Tampered claim should fail
    const isTamperedValid = MerkleTree.verify("GABC1:999_USDC", proof, root);
    expect(isTamperedValid).toBe(false);
  });

  it("handles trees with odd number of leaves correctly", () => {
    const claims = ["claim_1", "claim_2", "claim_3"];
    const tree = new MerkleTree(claims);
    const root = tree.getRoot();

    for (const claim of claims) {
      const proof = tree.getProof(claim);
      expect(MerkleTree.verify(claim, proof, root)).toBe(true);
    }
  });
});
