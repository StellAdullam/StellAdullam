## Summary

<!-- What does this PR do? One or two sentences. -->

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change fixing an issue)
- [ ] ✨ New feature (non-breaking change adding functionality)
- [ ] ♻️ Refactor / performance optimization
- [ ] 📝 Documentation / runbook update
- [ ] 🔒 Security hardening / compliance
- [ ] 💥 Breaking change (alters contract ABI or database schema)

---

## What Changed and Why

<!-- Detailed description of key changes and architectural motivation -->

---

## Stellar & Soroban Audit Checklist

- [ ] **Contract WASM Size**: Contract binary stays under network limit (`<= 1,048,576 bytes`).
- [ ] **Storage TTL Bumping**: State-mutating methods call `extend_ttl` on instance/persistent keys.
- [ ] **Oracle Guardrails**: Price-sensitive methods enforce staleness and future clock skew checks.
- [ ] **Access Control**: Administrative methods enforce `AdminControl::require_admin` or `require_auth()`.
- [ ] **Checks-Effects-Interactions**: Storage updates precede external token transfer calls.

---

## Monorepo Quality Checklist

- [ ] All CI workflows pass (`monorepo-ci`, `contracts-ci`, `api-ci`, `webapp-ci`, `shared-ci`, `land-ci`)
- [ ] Unit tests added / passing with >=80% coverage
- [ ] Prettier formatting verified (`bun run format:check` / `cargo fmt --check`)
- [ ] Zero Clippy warnings (`cargo clippy -- -D warnings`)
- [ ] No secrets or `.env` credentials committed
- [ ] Conventional Commits standard followed (`feat:`, `fix:`, `docs:`, `ci:`)

---

## Related Issues

<!-- Fixes #123 / Closes #456 -->
