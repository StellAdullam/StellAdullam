# Stellar Horizon & Soroban RPC Failover Architecture

**System:** StellAdullam Transaction Simulation & Event Indexing Infrastructure  
**Protocols:** Stellar Horizon REST API & Soroban JSON-RPC 2.0  
**Target Availability:** 99.99% Uptime SLA  

---

## 1. High-Availability RPC Pool Topology

To ensure uninterrupted transaction submission and event indexing during Stellar network congestion or public endpoint outages, StellAdullam utilizes a resilient multi-tier RPC provider topology:

```mermaid
graph TD
    Client["StellAdullam API & Indexer"] --> LB["Smart Circuit-Breaker RPC Client"]
    LB -->|Tier 1: Primary (Latency < 200ms)| SDF["SDF Public RPC (soroban-rpc.stellar.org)"]
    LB -->|Tier 2: Enterprise Fallback| QuickNode["QuickNode Dedicated Cluster"]
    LB -->|Tier 3: Secondary Fallback| Blockdaemon["Blockdaemon Soroban RPC"]
    LB -->|Tier 4: Local Private Node| LocalNode["Self-Hosted StellAdullam Validator Node"]
```

---

## 2. Dynamic Provider Failover & Health Checks

Each RPC endpoint in the provider pool is continuously monitored via active background health probes (`/health`) every 15 seconds.

### 2.1 Failure Triggers
An endpoint is marked degraded and removed from active rotation when:
1. **Consecutive HTTP Errors:** 3 consecutive 5xx or 429 (Rate Limit) responses.
2. **Timeout Violations:** Request duration exceeds 5,000ms.
3. **Ledger Lag:** Endpoint ledger sequence trails the global network consensus by > 3 ledgers (~15s).

### 2.2 Re-entry Probing
Once an endpoint trips the circuit breaker:
- It enters a 30-second cooldown period.
- A synthetic `getLatestLedger` probe is dispatched.
- Upon 2 consecutive successful probe responses with acceptable latency, the endpoint is restored to the primary rotation.

---

## 3. Configuration Parameters (`.env.production`)

```ini
# Primary and Secondary Soroban RPC Endpoints (comma-separated priority list)
STELLAR_RPC_ENDPOINTS="https://soroban-rpc.stellar.org,https://stellar-rpc.quicknode.pro/v1/secret,https://rpc.stelladullam.io"

# Horizon Fallback Endpoints
HORIZON_ENDPOINTS="https://horizon.stellar.org,https://horizon-backup.stelladullam.io"

# Health Probe Configuration
RPC_PROBE_INTERVAL_MS=15000
RPC_TIMEOUT_MS=5000
RPC_MAX_CONSECUTIVE_FAILURES=3
RPC_CIRCUIT_BREAKER_RESET_MS=30000

# Rate Limit Backoff Configuration
RPC_RETRY_MAX_ATTEMPTS=4
RPC_RETRY_BASE_BACKOFF_MS=250
RPC_RETRY_MAX_BACKOFF_MS=4000
```

---

## 4. Runbook for Manual Failover & Maintenance

If an active RPC provider experiences degraded network throughput during a high-traffic property drop:

### Step 1: Force Endpoint Drain
Update Kubernetes configmap to exclude degraded provider:
```bash
kubectl patch configmap api-config --type merge -p '{"data":{"ACTIVE_RPC_OVERRIDE":"https://stellar-rpc.quicknode.pro/v1/secret"}}'
```

### Step 2: Trigger Graceful Pod Reload
```bash
kubectl rollout restart deployment/stelladullam-api
kubectl rollout restart deployment/stelladullam-indexer
```

### Step 3: Verify Ledger Sync State
```bash
curl -s http://localhost:3000/api/v1/health/system | jq .probes.stellarRpc
```
Verify that `latencyMs < 350` and `healthy: true`.

