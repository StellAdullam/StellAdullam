# High-Availability Multi-Region Soroban RPC & Validator Architecture

This guide details the production deployment architecture for running resilient, geo-redundant Stellar Core validators and Soroban RPC nodes supporting StellAdullam protocol operations.

---

## 1. Network Topology

```
                         [Global Anycast DNS / Cloudflare]
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
      [Region 1: us-east-1]                       [Region 2: eu-west-1]
   ┌─────────────────────────┐                 ┌─────────────────────────┐
   │ AWS Network Load Balancer│                 │ AWS Network Load Balancer│
   └───────────┬─────────────┘                 └───────────┬─────────────┘
               │                                           │
   ┌───────────▼─────────────┐                 ┌───────────▼─────────────┐
   │  Soroban RPC Replicas   │                 │  Soroban RPC Replicas   │
   │  (Kubernetes HPA 3-10)  │                 │  (Kubernetes HPA 3-10)  │
   └───────────┬─────────────┘                 └───────────┬─────────────┘
               │                                           │
   ┌───────────▼─────────────┐                 ┌───────────▼─────────────┐
   │  Stellar Core Validator │◄──Quorum Gossip──►│  Stellar Core Validator │
   │   (StatefulSet NVMe)    │                 │   (StatefulSet NVMe)    │
   └─────────────────────────┘                 └─────────────────────────┘
```

---

## 2. Validator Node Specifications

To guarantee uninterrupted participation in the Stellar Consensus Protocol (SCP) and sub-second Soroban simulation responses:

| Component | Minimum Specification | Production Recommended |
| :--- | :--- | :--- |
| **CPU** | 8 vCPUs (3.2 GHz+) | 16 vCPUs (AMD EPYC / Intel Xeon) |
| **RAM** | 32 GB ECC DDR4 | 64 GB ECC DDR5 |
| **Disk** | 500 GB NVMe SSD (10k+ IOPS) | 2 TB Gen4 NVMe (50k+ IOPS) |
| **Network** | 1 Gbps dedicated | 10 Gbps redundant uplink |
| **OS** | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS hardened kernel |

---

## 3. Kubernetes StatefulSet Configuration

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: stellar-core-validator
  namespace: stelladullam-infra
spec:
  serviceName: "stellar-core-internal"
  replicas: 1
  template:
    spec:
      containers:
        - name: stellar-core
          image: stellar/stellar-core:v21.1.0
          resources:
            requests:
              cpu: "8000m"
              memory: "28Gi"
            limits:
              cpu: "14000m"
              memory: "56Gi"
          volumeMounts:
            - name: stellar-data
              mountPath: /var/lib/stellar
  volumeClaimTemplates:
    - metadata:
        name: stellar-data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: "gp3-nvme-iops"
        resources:
          requests:
            storage: 1500Gi
```

---

## 4. Health Probes & Automated Failover

1. **RPC Health Endpoint**:
   `GET http://localhost:8000/health` must respond with HTTP 200 within 1,500ms.
2. **Ledger Lag Alerting**:
   If the local node sequence lags > 3 ledgers behind the public network consensus, Prometheus alerts trigger automatic traffic shedding via ingress weight reassignment.
3. **Database Maintenance**:
   Automated hourly checkpoint validation with daily history archive sweeps to AWS S3 / Cloudflare R2 bucket (`s3://stelladullam-ledger-history-cold`).

