# ProofMind — Immutable AI Audit Infrastructure

**Cryptographic notarization for every AI decision. Anchored on Hedera. Queryable by regulators.**

> **Track:** Open Track | **Bounty:** AWS ($8,000)

ProofMind wraps enterprise AI models with a lightweight SDK that hashes every inference input and output, signs the hash via AWS KMS, and anchors it to Hedera HCS in real time. Enterprises keep all sensitive data private — only SHA-256 hashes leave their infrastructure. Regulators get a tamper-proof, independently verifiable audit trail they can query directly.

---

## The Problem

Regulators (EU AI Act, SEC, FDA, UK FCA) are demanding explainable, auditable AI decisions — but enterprises have no credible way to prove their AI behaved correctly after the fact. Logs can be deleted. Databases can be modified. Audit reports are self-certified. There is no tamper-proof, independently verifiable record of what an AI system actually decided.

---

## The Solution

ProofMind creates an immutable chain of custody for AI decisions:

1. Enterprise wraps AI inference with the ProofMind SDK (Python or Node.js decorator / context manager)
2. SDK hashes inputs + outputs with SHA-256, signs via AWS KMS (ECDSA P-256)
3. Hash + signature + model metadata anchored to Hedera HCS in < 50ms latency overhead
4. Audit Agent monitors the HCS topic for anomalies in real time
5. Regulators query the Audit Agent in natural language via HCS-10 and receive on-chain verified responses

**Zero sensitive data leaves the enterprise.** Only hashes. GDPR-safe by design.

---

## System Architecture

```mermaid
flowchart TD
    subgraph Enterprise["Enterprise Infrastructure"]
        AI[AI Model\nLoan decisions · Medical · Trading]
        SDK[ProofMind SDK\nPython / Node.js wrapper]
        KMS[AWS KMS\nECDSA P-256 signing · CloudTrail]
    end

    subgraph Backend["Backend — Supabase + AWS"]
        DB[(PostgreSQL\nNotarizations · Models · Alerts)]
        EF[Edge Functions\nSync · Anomaly alerts]
        COG[AWS Cognito\nEnterprise SSO]
    end

    subgraph Hedera["Hedera Hashgraph"]
        HCS[HCS\nImmutable notarization log]
        HCS10[HCS-10\nRegulator query protocol]
    end

    subgraph Agent["HOL Registry — Audit Agent"]
        AA[Audit Agent\nAnomaly detection · Compliance reports]
    end

    subgraph Portals["Frontend — React + Vite"]
        EP[Enterprise Dashboard\nModels · Notarizations · Alerts]
        RP[Regulator Portal\nQuery · Verify · Export]
    end

    AI -->|inference| SDK
    SDK -->|hash inputs+outputs| KMS
    KMS -->|signed hash <50ms| HCS
    HCS -->|subscribe| AA
    AA -->|anomaly alerts| EF
    EF <--> DB
    DB --> EP & RP
    RP -->|NL query| HCS10
    HCS10 -->|verified response| AA
    AA -->|on-chain answer| HCS10
```

---

## Notarization Flow

```mermaid
sequenceDiagram
    participant AI  as 🤖 AI Model
    participant SDK as ProofMind SDK
    participant KMS as AWS KMS
    participant HCS as Hedera HCS
    participant AA  as Audit Agent
    participant REG as 📋 Regulator

    AI->>SDK: inference(input) → output
    SDK->>SDK: SHA-256(input) + SHA-256(output)\n+ model_id + timestamp
    SDK->>KMS: sign(hash_bundle)
    KMS-->>SDK: ECDSA signature (CloudTrail logged)
    SDK->>HCS: anchor notarization record
    SDK-->>AI: return output (< 50ms overhead)

    HCS-->>AA: new notarization detected
    AA->>AA: Check 7 anomaly classes\n(unregistered model, volume spike,\njurisdiction violation, distribution shift…)

    REG->>HCS: "How many loan decisions in Q1 EU?"
    HCS->>AA: route via HCS-10
    AA->>AA: Query HCS + Supabase
    AA->>HCS: Anchor verified response
    HCS-->>REG: ✅ On-chain proof of answer
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL + Edge Functions + Realtime) |
| Blockchain | Hedera Hashgraph (HCS, HTS, Scheduled Transactions) |
| Key Management | AWS KMS (ECDSA P-256) + CloudTrail + Cognito SSO |
| SDK | Python & Node.js AI inference wrappers |
| Agent | HOL Registry — Audit Agent per enterprise |

## Hedera Services Used

| Service | Usage |
|---------|-------|
| **HCS** | Every notarization anchored as an immutable, ordered, timestamped record |
| **HCS-10** | Bidirectional regulator query protocol — natural language in, on-chain proof out |
| **HTS** | Enterprise compliance license tokens (non-transferable) |
| **Scheduled Transactions** | Automated weekly compliance report generation |
| **Mirror Node** | Historical notarization lookups, provenance chain retrieval |

---

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Fill in Supabase credentials, AWS KMS key ARN, Hedera operator credentials

# Run the development server
npm run dev
```

---

## Documentation

- [Architecture Reference](./proofmind.md) — Full technical specification
- [Demo Setup](./DEMO_SETUP.md) — Step-by-step demo configuration
- [Demo Video Script](./DEMO_VIDEO_SCRIPT.md) — Walkthrough script

---

## License

MIT — ProofMind v1.0
