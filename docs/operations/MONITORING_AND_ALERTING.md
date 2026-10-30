# StellAdullam Monitoring, Telemetry & Incident Escalation Runbook

## Overview
This runbook defines the observability architecture, Prometheus alerting rules, Service Level Objectives (SLOs), and incident response escalation matrix across all StellAdullam production infrastructure.

---

## 1. Service Level Objectives (SLOs)

| Service Component | Metric Indicator | Target SLO | Measurement Window |
| :--- | :--- | :--- | :--- |
| **API Gateway** | Request Success Rate (`2xx` & `3xx`) | `≥ 99.9%` | 30-day rolling |
| **API Latency** | `p95` response latency | `< 150 ms` | 5-minute rolling |
| **Soroban Indexer** | Ledger Lag (`network_seq - indexed_seq`) | `< 2 ledgers` | Continuous |
| **PostgreSQL Database** | Active Connection Pool Usage | `< 80%` | Continuous |
| **Liquidation Engine** | Undercollateralized Sweep Delay | `< 12 seconds` | Continuous |

---

## 2. Prometheus Alerting Rules

Prometheus rules configuration (`/etc/prometheus/rules/stelladullam-alerts.yml`):

```yaml
groups:
  - name: stelladullam-core-alerts
    rules:
      # Alert when Soroban indexer lags behind public network
      - alert: SorobanIndexerLedgerLag
        expr: stellar_network_latest_ledger - stelladullam_indexer_latest_ledger > 3
        for: 2m
        labels:
          severity: critical
          tier: blockchain
        annotations:
          summary: "Soroban ledger indexer is lagging behind network"
          description: "Indexer is lagging by {{ $value }} ledgers for more than 2 minutes."

      # Alert when API error rate spikes
      - alert: HighApiErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100 > 1.0
        for: 3m
        labels:
          severity: warning
          tier: backend
        annotations:
          summary: "API 5xx error rate exceeded 1%"
          description: "Error rate is currently {{ $value }}%."

      # Alert on lending pool liquidation bot failure
      - alert: LiquidationBotStalled
        expr: time() - stelladullam_liquidation_last_sweep_timestamp > 60
        for: 1m
        labels:
          severity: critical
          tier: defi
        annotations:
          summary: "Liquidation bot has stopped sweeping positions"
          description: "Last health factor scan was over 60 seconds ago."
```

---

## 3. Incident Severity Levels & Escalation Matrix

### Severity Tiers

1. **SEV-1 (Critical)**:
   - *Criteria*: Complete outage of API, ledger sync stalled > 5 minutes, unauthorized contract drain attempt, or liquidation bot offline with unhealthy loans.
   - *Response Time*: `< 10 minutes`.
   - *Escalation*: Automated page to Primary On-Call Engineer and Tech Lead. Incident Slack channel `#incident-sev1` created.

2. **SEV-2 (High)**:
   - *Criteria*: Partial degradation, p95 latency > 500ms, single RPC provider outage with failover active, or elevated 4xx/rate limit spikes.
   - *Response Time*: `< 30 minutes`.
   - *Escalation*: Slack alert to `#eng-alerts`. Primary On-Call Engineer investigates.

3. **SEV-3 (Low / Informational)**:
   - *Criteria*: Non-critical background task failure, minor telemetry drop, or non-blocking UI rendering warning.
   - *Response Time*: Next business day.

---

## 4. Verification and Remediation Steps

### When `SorobanIndexerLedgerLag` Fires:
1. Verify public Stellar Horizon & RPC health:
   ```bash
   curl -s https://soroban-testnet.stellar.org/health
   ```
2. Check local indexer container logs:
   ```bash
   docker logs --tail 100 stelladullam-indexer
   ```
3. Restart indexer daemon if locked:
   ```bash
   docker restart stelladullam-indexer
   ```

