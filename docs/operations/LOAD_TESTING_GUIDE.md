# StellAdullam Load Testing Guide & Benchmarks

This document outlines the performance benchmarking methodology, load-testing configurations, and target Service Level Objectives (SLOs) for the StellAdullam backend API and Soroban RPC gateway.

---

## 1. Performance Target SLOs

| Endpoint / Action | Target Concurrency | Target p95 Latency | Error Budget (max) |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/healthz` | 2,500 RPS | < 15ms | 0.001% |
| `GET /api/v1/analytics/overview` | 1,000 RPS | < 45ms | 0.01% |
| `GET /api/v1/portfolio/:address` | 500 RPS | < 80ms | 0.05% |
| `POST /api/v1/simulate` | 100 RPS | < 350ms (Soroban RPC bounded) | 0.1% |
| `POST /api/v1/fee-bump` | 50 RPS | < 180ms | 0.05% |

---

## 2. Load Testing with k6

StellAdullam includes continuous synthetic load generators using Grafana k6.

### Running the API Smoke Test
```bash
# Run a quick 1-minute ramp test against local or staging environment
k6 run --vus 20 --duration 1m scripts/load-tests/api-smoke.js
```

### Sample k6 Test Script (`scripts/load-tests/api-stress.js`)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Warm up to 50 users
    { duration: '1m', target: 200 },  // Ramp to 200 concurrent users
    { duration: '2m', target: 500 },  // Stress at 500 concurrent users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<150'], // 95% of requests must complete below 150ms
    http_req_failed: ['rate<0.01'],    // Less than 1% failure
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3001';

export default function () {
  // Test Analytics Overview
  const resAnalytics = http.get(`${BASE_URL}/api/v1/analytics/overview`);
  check(resAnalytics, {
    'analytics status is 200': (r) => r.status === 200,
    'analytics has TVL': (r) => JSON.parse(r.body).totalValueLockedXlm !== undefined,
  });

  // Test Portfolio Query
  const testAddress = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN7';
  const resPortfolio = http.get(`${BASE_URL}/api/v1/portfolio/${testAddress}`);
  check(resPortfolio, {
    'portfolio status is 200': (r) => r.status === 200,
  });

  sleep(0.1);
}
```

---

## 3. Soroban RPC Rate Limit Safeguards

When executing stress tests against Stellar Soroban Testnet / Mainnet:
1. **Never blast unthrottled simulation calls**:
   Public testnet RPC endpoints (`https://soroban-testnet.stellar.org`) enforce strict IP and API rate limits (typically 100 req/sec per IP).
2. **Use local standalone RPC node for isolated load testing**:
   ```bash
   docker run --rm -it \
     -p 8000:8000 \
     --name stellar-standalone \
     stellar/quickstart:testing \
     --standalone \
     --enable-soroban-rpc
   ```
3. **Monitor Cache Hit Rates**:
   Ensure `HistoricalApyService` and `GeocodingService` in-memory LRU caches achieve > 85% cache hit ratio under high read volumes.
